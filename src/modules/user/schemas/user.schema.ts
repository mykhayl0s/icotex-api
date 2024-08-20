import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'
export type UserDocument = User & Document;

export enum ERole {
  Admin = 'Admin',
  Manager = 'Manager',
  TeamLead = 'TeamLead',
  Sale = 'Sale',
  User = 'User'
}

@Schema({ versionKey: false })
export class User {

  _id: string

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, enum: ERole })
  team: ERole

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password; // Remove password field
    return ret;
  },
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password; // Remove password field
    return ret;
  },
});