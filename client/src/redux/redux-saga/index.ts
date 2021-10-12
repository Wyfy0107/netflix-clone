import { all } from 'redux-saga/effects'
import authSaga from './auth'
import moviesSaga from './movies'
import userSaga from './user'

export default function* rootSaga() {
  yield all([...authSaga, ...moviesSaga, ...userSaga])
}
