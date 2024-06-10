import { Module } from '@nestjs/common';
import { UsersModule } from './user-service/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreModule } from './score/score.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost/nest2'),
    ScoreModule,
    ClientsModule.register([
      {
        name: 'USER-SERVICE',
        transport: Transport.TCP,
        options: { host: 'user-service', port: 3001 },
      },
      {
        name: 'SCORE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'score-service', port: 3002 },
      },
      {
        name: 'AI_SERVICE',
        transport: Transport.TCP,
        options: { host: 'ai-service', port: 3003 },
      },
      {
        name: 'AR_SERVICE',
        transport: Transport.TCP,
        options: { host: 'ar-service', port: 3004 },
      },
    ]),
  ],
})
export class AppModule {}
