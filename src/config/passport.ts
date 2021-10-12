import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import passportGoogle from 'passport-google-oauth20'

import AuthService from '../services/auth'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const GoogleStrategy = passportGoogle.Strategy

const local = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email: string, password: string, done: any) => {
    try {
      const user = await AuthService.findUserByEmail(email)

      if (!user) {
        return done(null, false, { message: `Email ${email} not found` })
      }

      const passCheck = await bcrypt.compare(password, user.password)
      if (!passCheck) {
        return done(null, false, { message: 'Invalid email or password' })
      }

      return done(null, user)
    } catch (error) {
      console.log('error', error)
    }
  }
)

const jwt = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    const { userId } = jwtPayload
    const user = await AuthService.findUserById(userId)

    if (!user) return done(null, false)

    return done(null, user)
  }
)

const google = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ['profile', 'email'],
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    const user = await AuthService.findOrCreate(profile)
    return done(null, user)
  }
)

export default { local, jwt, google }
