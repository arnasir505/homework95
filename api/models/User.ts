import bcrypt from 'bcrypt';
import { HydratedDocument, Model, Schema, model } from 'mongoose';
import { UserFields } from '../types';
import { randomUUID } from 'crypto';
import * as EmailValidator from 'email-validator';

const SALT_WORK_FACTOR = 10;

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new Schema<UserFields, UserModel>(
  {
    email: {
      type: String,
      required: [true, 'Please enter your email address.'],
      unique: true,
      validate: [
        {
          validator: function (email: string) {
            return EmailValidator.validate(email);
          },
          message: 'Please enter a valid email address.',
        },
        {
          validator: async function (
            this: HydratedDocument<UserFields>,
            email: string
          ): Promise<boolean> {
            if (!this.isModified('email')) return true;

            const user: HydratedDocument<UserFields> | null =
              await User.findOne({
                email,
              });
            return !Boolean(user);
          },
          message: 'This email is already taken.',
        },
      ],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password.'],
      validate: {
        validator: function (password: string) {
          if (password.length < 6) {
            return false;
          }
        },
        message: 'Your password must be at least 6 characters.',
      },
    },
    token: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
    displayName: {
      type: String,
      required: [true, 'Please enter your name.'],
    },
    avatar: {
      type: String,
      required: [true, 'Please upload your profile picture.'],
    },
    googleID: String,
  },
  {
    versionKey: false,
  }
);

UserSchema.method('checkPassword', async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

UserSchema.method('generateToken', function () {
  this.token = randomUUID();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;

  next();
});

UserSchema.set('toJSON', {
  transform(_doc, ret, _options) {
    delete ret.password;
    return ret;
  },
});

const User = model<UserFields, UserModel>('User', UserSchema);

export default User;
