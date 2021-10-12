import mongoose, { Document, Schema } from 'mongoose'

export type UserDocument = Document & {
  _id: string;
  googleId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  favMovie: string[];
  photo: string;
  isAdmin: boolean;
}

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  firstName: {
    type: String,
    index: true,
    minlength: 1,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
  },
  photo: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
  favMovie: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Movies-Lists',
    },
  ],
})

export default mongoose.model<UserDocument>('User', userSchema)
