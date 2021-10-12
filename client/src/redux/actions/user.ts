import { ActionTypes, Options } from './types'

export const getUserData = (): ActionTypes => {
  return {
    type: 'GET_USER_DATA',
  }
}

export const addFavMovie = (
  movieId: string,
  options?: Options
): ActionTypes => {
  return {
    type: 'ADD_FAV_MOVIE',
    payload: movieId,
    options,
  }
}
