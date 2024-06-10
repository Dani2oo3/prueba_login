import { NestFactory } from '@nestjs/core';
import { AppModule } from './../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002); // Puerto específico para score
  console.log(`Score service is running on: http://localhost:3002`);
}
bootstrap();
