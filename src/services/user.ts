import User from '../models/User'
import Movie from '../models/Movie'
import { InternalServerError } from '../helpers/apiError'

const add = async (
  userId: string,
  movieId: string
): Promise<string | undefined> => {
  try {
    const user = await User.findById(userId)
    const movie = await Movie.findById(movieId)

    if (!user) {
      throw new Error('User not found')
    }
    if (!movie) {
      throw new Error('Movie not found')
    }

    if (user.favMovie.includes(movieId)) {
      const movieIndex = user.favMovie.indexOf(movieId)
      user.favMovie.splice(movieIndex, 1)
      await user.save()
    }
    if (movie.likedBy.includes(userId)) {
      const userIndex = movie.likedBy.indexOf(userId)
      movie.likedBy.splice(userIndex, 1)
      await movie.save()
      return 'movie removed'
    } else {
      user.favMovie.push(movieId)
      movie.likedBy.push(userId)

      await user.save()
      await movie.save()
      return 'movie added'
    }
  } catch (error) {
    throw new InternalServerError()
  }
}

export default {
  add,
}
