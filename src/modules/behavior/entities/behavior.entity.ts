import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type BehaviorDocument = Behavior & Document;

@Schema({
  timestamps: true,
})
export class Behavior {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  // Reference to User's entity will be used in proper implementation, (This is out of the scope of this assessment )
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  points: string;
}

export const BehaviorSchema = SchemaFactory.createForClass(Behavior);
