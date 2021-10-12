import { ActionTypes, Movie } from './types'

export const getMovies = (): ActionTypes => {
  return {
    type: 'GET_MOVIES',
  }
}

export const getMoviesSuccess = (movies: any): ActionTypes => {
  return {
    type: 'GET_MOVIES_SUCCESS',
    payload: movies,
  }
}

export const getMoviesFailed = (): ActionTypes => {
  return {
    type: 'GET_MOVIES_FAILED',
  }
}

export const searchMovies = (name: string): ActionTypes => {
  return {
    type: 'SEARCH_MOVIES',
    payload: name,
  }
}

export const searchMoviesSuccess = (result: Movie[]): ActionTypes => {
  return {
    type: 'SEARCH_MOVIES_SUCCESS',
    payload: result,
  }
}

export const emptySearch = (): ActionTypes => {
  return {
    type: 'EMPTY_SEARCH',
  }
}

export const newMovieReceived = (movie: Movie) => {
  return {
    type: 'NEW_MOVIE_RECEIVED',
    payload: movie,
  }
}
