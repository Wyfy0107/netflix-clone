import express from 'express'
import passport from 'passport'

import { createUser, localLogin, googleLogin } from '../controllers/auth'
import formValidate from '../middlewares/formValidator'

const router = express.Router()

//**path for api/v1/auth */
router.post('/register', formValidate.register, createUser)

router.post('/login/local', formValidate.login, localLogin)

router.post(
  '/login/google',
  passport.authenticate('google-id-token', {
    scope: ['profile', 'email'],
    session: false,
  }),
  googleLogin
)

export default router
