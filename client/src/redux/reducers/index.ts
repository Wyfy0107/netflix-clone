import { combineReducers } from 'redux'

import auth from './auth'
import movies from './movies'
import user from './user'

const createRootReducer = () => combineReducers({ movies, auth, user })

export default createRootReducer
