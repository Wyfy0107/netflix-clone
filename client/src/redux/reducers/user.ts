import { ActionTypes } from '../actions/types'

const initialState = {
  selectedMovieId: '',
}

const user = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case 'ADD_FAV_MOVIE':
      if ('payload' in action) {
        return {
          selectedMovieId: action.payload,
        }
      }
      break

    default:
      return state
  }
}

export default user
