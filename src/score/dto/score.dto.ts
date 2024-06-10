import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ScoreDto {
  @ApiProperty({ description: 'La puntuación del usuario' })
  @IsNumber()
  @IsNotEmpty()
  score: number;
}