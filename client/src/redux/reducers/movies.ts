import { ActionTypes, Movie } from '../actions/types'

type InitialState = {
  moviesList: Movie[]
  searchName: string
  searchResult: Movie[]
  newMovie: Partial<Movie>[]
}

const initialState: InitialState = {
  moviesList: [],
  searchName: '',
  searchResult: [],
  newMovie: [],
}

const movies = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case 'GET_MOVIES_SUCCESS':
      if ('payload' in action) {
        return {
          ...state,
          moviesList: [...action.payload],
        }
      }
      break

    case 'SEARCH_MOVIES':
      if ('payload' in action) {
        return {
          ...state,
          searchName: action.payload,
        }
      }
      break

    case 'SEARCH_MOVIES_SUCCESS':
      if ('payload' in action) {
        return {
          ...state,
          searchResult: [...action.payload],
        }
      }
      break

    case 'EMPTY_SEARCH':
      return {
        ...state,
        searchResult: [],
      }

    case 'NEW_MOVIE_RECEIVED':
      if ('payload' in action) {
        return {
          ...state,
          newMovie: [...state.newMovie, action.payload],
        }
      }
      break

    default:
      return state
  }
}

export default movies
