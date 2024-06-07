import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreDto } from './dto/score.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addScore(@Request() req, @Body() scoreDto: ScoreDto) {
    const userId = req.user.sub;
    return this.scoreService.addScore(userId, scoreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserScores(@Request() req) {
    const userId = req.user.sub;
    return this.scoreService.getUserScores(userId);
  }
}