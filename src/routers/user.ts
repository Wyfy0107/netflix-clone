import express from 'express'

import {
  addFavMovie,
  getUserData,
  // forgotPassword,
  // resetPassword,
} from '../controllers/user'
import tokenVerify from './../middlewares/tokenVerify'

const router = express.Router()

//**All routes here will have /api/v1/user prefix */
router.put('/add-fav', tokenVerify, addFavMovie)
router.get('/data', tokenVerify, getUserData)
// router.post('/forgot-password', forgotPassword)
// router.get('/password-reset/:paramId', resetPassword)

export default router
