import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Object.values(config).every(Boolean);
export const firebaseApp = firebaseReady ? (getApps().length ? getApp() : initializeApp(config)) : null;
type FirebaseRuntime = typeof globalThis & { __paletcimAppCheck?: ReturnType<typeof initializeAppCheck>; __paletcimEmulatorsConnected?: boolean };
const runtime = globalThis as FirebaseRuntime;
export const appCheck = firebaseApp && typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY && !runtime.__paletcimAppCheck
  ? (runtime.__paletcimAppCheck = initializeAppCheck(firebaseApp, { provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY), isTokenAutoRefreshEnabled: true }))
  : runtime.__paletcimAppCheck ?? null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const functions = firebaseApp ? getFunctions(firebaseApp, "europe-west1") : null;
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" && auth && db && functions && !runtime.__paletcimEmulatorsConnected) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  runtime.__paletcimEmulatorsConnected = true;
}
