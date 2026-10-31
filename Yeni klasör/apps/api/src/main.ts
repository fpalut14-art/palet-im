import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" });
  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
  console.log(`PALETÇİM API hazır: http://localhost:${port}/api/v1/health`);
}
void bootstrap();
