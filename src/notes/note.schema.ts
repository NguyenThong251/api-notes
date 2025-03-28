import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  content: string;

  @Prop()
  description: string;

  @Prop({ enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  reminder: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: string; // Người tạo task

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  sharedWith: string[]; // Người được chia sẻ
}

export const TaskSchema = SchemaFactory.createForClass(Task);