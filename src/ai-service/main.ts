import { NestFactory } from '@nestjs/core';
import { AppModule } from './../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003); // Puerto específico para ai-service
  console.log(`AI service is running on: http://localhost:3003`);
}
bootstrap();
