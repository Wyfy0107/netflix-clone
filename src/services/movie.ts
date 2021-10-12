import Movie, { MovieDocument } from '../models/Movie'
import { Options } from '../types/queryOptions'

function create(movie: MovieDocument): Promise<MovieDocument> {
  return movie.save()
}

function findById(movieId: string): Promise<MovieDocument> {
  return Movie.findById(movieId)
    .populate({ path: 'likedBy', select: 'firstName lastName -_id' })
    .exec() // .exec() will return a true Promise
    .then((movie) => {
      if (!movie) {
        throw new Error(`Movie ${movieId} not found`)
      }
      return movie
    })
}

const findByName = async (movieName: string): Promise<MovieDocument[]> => {
  try {
    const regex = new RegExp(`${movieName}`, 'ig')
    const movie = await Movie.find({ name: { $regex: regex } })

    return movie
  } catch (error) {
    throw new Error(`Movie ${movieName} not found`)
  }
}

const findByGenres = async (movieGenres: string): Promise<MovieDocument[]> => {
  try {
    const movie = await Movie.find().where('genres').in([movieGenres])

    if (movie.length === 0) {
      throw new Error()
    }

    return movie
  } catch (error) {
    throw new Error(`No movie matches ${movieGenres} genres`)
  }
}

async function findAll({
  latest = 1,
  limit = 0,
  page = 1,
}: Partial<Options>): Promise<MovieDocument[]> {
  try {
    const pageCal = limit * (page - 1)

    const result = await Movie.find()
      .sort({ publishedYear: latest })
      .skip(pageCal)
      .limit(limit)

    if (result.length === 0) {
      throw new Error()
    }

    return result
  } catch (error) {
    throw new Error('Database is empty')
  }
}

function update(
  movieId: string,
  update: Partial<MovieDocument>
): Promise<MovieDocument> {
  return Movie.findById(movieId)
    .exec()
    .then((movie) => {
      if (!movie) {
        throw new Error(`Movie ${movieId} not found`)
      }

      if (update.name) {
        movie.name = update.name
      }
      if (update.publishedYear) {
        movie.publishedYear = update.publishedYear
      }
      if (update.duration) {
        movie.duration = update.duration
      }
      if (update.description) {
        movie.description = update.description
      }
      if (update.cast) {
        movie.cast = update.cast
      }
      if (update.genres) {
        movie.genres = update.genres
      }

      // Add more fields here if needed
      return movie.save()
    })
}

function deleteMovie(movieId: string): Promise<MovieDocument | null> {
  return Movie.findByIdAndDelete(movieId).exec()
}

export default {
  create,
  findById,
  findByGenres,
  findByName,
  findAll,
  update,
  deleteMovie,
}
