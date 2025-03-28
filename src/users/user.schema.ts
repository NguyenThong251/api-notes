import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  zaloId: string; // Zalo User ID

  @Prop()
  name: string; // Tên người dùng từ Zalo
}

export const UserSchema = SchemaFactory.createForClass(User);