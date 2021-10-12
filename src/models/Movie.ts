import mongoose, { Document, Schema } from 'mongoose'

export type MovieDocument = Document & {
  _id: string;
  name: string;
  description: string;
  publishedYear: number;
  genres: string[];
  duration: number;
  rating: number;
  cast: string[];
  likedBy: string[];
  poster: string;
  background: string;
}

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
    required: true,
    min: 1900,
  },
  genres: {
    type: [String],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
  },
  cast: {
    type: [String],
    required: true,
  },
  poster: {
    type: String,
  },
  background: {
    type: String,
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
})

export default mongoose.model<MovieDocument>('Movies-Lists', movieSchema)
