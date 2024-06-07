import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScoreDocument = Score & Document;

@Schema()
export class Score {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  score: number;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);