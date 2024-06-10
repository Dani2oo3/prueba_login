import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score, ScoreDocument } from './entities/score.entity';
import { ScoreDto } from './dto/score.dto';

@Injectable()
export class ScoreService {
  constructor(@InjectModel(Score.name) private scoreModel: Model<ScoreDocument>) {}

  async addScore(userId: string, scoreDto: ScoreDto): Promise<Score> {
    const score = new this.scoreModel({
      userId,
      score: scoreDto.score,
    });

    return score.save();
  }

  async getUserScores(userId: string): Promise<Score[]> {
    return this.scoreModel.find({ userId }).exec();
  }
}