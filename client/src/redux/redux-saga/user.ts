import { AppState } from './../types'
import { put, takeLatest, select } from 'redux-saga/effects'
import axios, { AxiosError } from 'axios'

import { setLogOut } from '../actions'
import { url } from '../../App'
import { AddFavMovieAction } from './../actions/types'

const addUrl = `${url}/api/v1/user/add-fav`

const userID = (state: AppState) => state.auth.userData._id

function* addFavMovie(action: AddFavMovieAction): any {
  const { payload: movieId, options } = action

  try {
    const userId = yield select(userID)
    yield axios.put(addUrl, { userId, movieId })
    options?.onSuccess()
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 401) {
      return yield put(setLogOut())
    }
  }
}

const sagaWatcher = [takeLatest('ADD_FAV_MOVIE', addFavMovie)]

export default sagaWatcher
