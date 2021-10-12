import { put, takeLatest, select } from 'redux-saga/effects'
import axios, { AxiosError } from 'axios'

import {
  getMoviesSuccess,
  getMoviesFailed,
  setLogOut,
  searchMoviesSuccess,
  emptySearch,
} from '../actions'
import { AppState } from '../types'
import { url } from '../../App'

const movieUrl = `${url}/api/v1/movies`
const searchUrl = `${url}/api/v1/movies/name?movieName=`

const searchName = (state: AppState) => state.movies.searchName

function* fetchMovies(): any {
  try {
    const res = yield axios.get(movieUrl)
    yield put(getMoviesSuccess(res.data))
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 401) {
      return yield put(setLogOut())
    }
    yield put(getMoviesFailed())
  }
}

function* searchMovies(): any {
  try {
    const movieName: string = yield select(searchName)
    const url = searchUrl + movieName
    const res = yield axios.get(url)
    yield put(searchMoviesSuccess(res.data))
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 401) {
      return yield put(setLogOut())
    }
    if (axiosError.response?.status === 404) {
      return yield put(emptySearch())
    }
  }
}

const sagaWatcher = [
  takeLatest('GET_MOVIES', fetchMovies),
  takeLatest('SEARCH_MOVIES', searchMovies),
]

export default sagaWatcher
