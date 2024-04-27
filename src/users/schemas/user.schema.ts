import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, unique: true })
  gitHubUsername: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ required: true, type: Number, default: 0 })
  inputTokensConsumed: number;

  @Prop({ required: true, type: Number, default: 0 })
  outputTokensConsumed: number;

  @Prop({ type: String })
  openAIapiKey: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
