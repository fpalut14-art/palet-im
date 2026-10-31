import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { auth } from "firebase-functions/v1";

initializeApp();
const db = getFirestore();
const REGISTRATION_FEE_KURUŞ = 35_000;

// The payment provider is intentionally an interface. A membership is activated only
// by a provider adapter that validates that provider's signed webhook.
interface CheckoutProvider {
  createHostedCheckout(input: { uid: string; email: string; amountKurus: number; currency: "TRY"; idempotencyKey: string }): Promise<{ url: string; providerReference: string }>;
}
function getCheckoutProvider(): CheckoutProvider {
  throw new HttpsError("failed-precondition", "Ödeme sağlayıcısı henüz yapılandırılmadı; ödeme alınmadı.");
}

export const initializeNewMember = auth.user().onCreate(async (user) => {
  const profile = db.doc(`users/${user.uid}`);
  await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(profile);
    if (existing.exists) return;
    transaction.create(profile, {
      uid: user.uid,
      email: user.email ?? null,
      membershipStatus: "pending_payment",
      registrationFeeKurus: REGISTRATION_FEE_KURUŞ,
      currency: "TRY",
      emailVerified: user.emailVerified,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
});

export const createRegistrationCheckout = onCall({ enforceAppCheck: true }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Önce hesabınıza giriş yapın.");
  if (request.auth.token.email_verified !== true) throw new HttpsError("failed-precondition", "Ödeme öncesinde e-posta adresinizi doğrulayın.");
  const uid = request.auth.uid;
  const member = await db.doc(`users/${uid}`).get();
  if (member.data()?.membershipStatus === "active") return { status: "active" };
  const provider = getCheckoutProvider();
  const checkout = await provider.createHostedCheckout({ uid, email: String(request.auth.token.email ?? ""), amountKurus: REGISTRATION_FEE_KURUŞ, currency: "TRY", idempotencyKey: `registration-${uid}` });
  const payment = db.collection("payments").doc();
  await payment.set({ uid, type: "registration", amountKurus: REGISTRATION_FEE_KURUŞ, currency: "TRY", status: "pending", providerReference: checkout.providerReference, createdAt: FieldValue.serverTimestamp() });
  return { status: "pending", checkoutUrl: checkout.url };
});

export const createListingBoostCheckout = onCall({ enforceAppCheck: true }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Önce hesabınıza giriş yapın.");
  if (request.auth.token.email_verified !== true) throw new HttpsError("failed-precondition", "E-posta adresinizi doğrulayın.");
  const uid = request.auth.uid;
  const member = await db.doc(`users/${uid}`).get();
  if (member.data()?.membershipStatus !== "active") throw new HttpsError("permission-denied", "İlan öne çıkarma için aktif üyelik gerekir.");
  const listingId = String(request.data?.listingId ?? "");
  const packageId = String(request.data?.packageId ?? "");
  if (!listingId || !packageId) throw new HttpsError("invalid-argument", "İlan ve boost paketi seçilmelidir.");
  const [listing, offer] = await Promise.all([db.doc(`listings/${listingId}`).get(), db.doc(`boostPackages/${packageId}`).get()]);
  if (!listing.exists || listing.data()?.ownerUid !== uid || listing.data()?.status !== "active") throw new HttpsError("not-found", "Etkin ilanınız bulunamadı.");
  const pricing = offer.data();
  if (!pricing || pricing.status !== "active" || !Number.isInteger(pricing.priceKurus) || !Number.isInteger(pricing.durationDays)) throw new HttpsError("failed-precondition", "Seçilen boost paketi şu anda kullanılamıyor.");
  const provider = getCheckoutProvider();
  const checkout = await provider.createHostedCheckout({ uid, email: String(request.auth.token.email ?? ""), amountKurus: pricing.priceKurus, currency: "TRY", idempotencyKey: `boost-${listingId}-${packageId}-${uid}` });
  const payment = db.collection("payments").doc();
  await payment.set({ uid, type: "listing_boost", listingId, packageId, durationDays: pricing.durationDays, amountKurus: pricing.priceKurus, currency: "TRY", status: "pending", providerReference: checkout.providerReference, createdAt: FieldValue.serverTimestamp() });
  return { status: "pending", checkoutUrl: checkout.url };
});

// Provider-specific signature verification and webhook event mapping must be added
// before enabling checkout. No client callable can set membershipStatus to active.
export const paymentWebhookNotConfigured = onRequest(async (_request, response) => {
  logger.warn("Payment webhook called before a provider adapter was configured.");
  response.status(503).json({ error: "payment_provider_not_configured", message: "Ödeme doğrulama bağlantısı henüz yapılandırılmadı." });
});
