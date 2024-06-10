import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { Score, ScoreSchema } from './entities/score.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/score/auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Score.name, schema: ScoreSchema}]),
    JwtModule.register({
        secret: 'jwt_secret',
        signOptions: { expiresIn: '1d' }, // Token expira después de 1 día
      }),
  ], 
  controllers: [ScoreController],
  providers: [ScoreService, JwtAuthGuard],
})
export class ScoreModule {}
