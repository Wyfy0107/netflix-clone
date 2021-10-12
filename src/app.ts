import express from 'express'
import compression from 'compression'
import lusca from 'lusca'
import mongoose from 'mongoose'
import passport from 'passport'
import bluebird from 'bluebird'
import cors from 'cors'
import http from 'http'
import io from 'socket.io'

import { MONGODB_URI } from './util/secrets'

import movieRouter from './routers/movie'
import authRouter from './routers/auth'
import userRouter from './routers/user'

import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

import Movie from './models/Movie'
import PassportStrategy from './config/passport'
import logger from './util/logger'

const app = express()
const mongoUrl = MONGODB_URI

mongoose.Promise = bluebird
mongoose
  .connect(mongoUrl as string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    logger.info('connected to mongodb')
  })
  .catch((err: Error) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middleware
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(passport.initialize())
app.use(apiContentType)

passport.use(PassportStrategy.local)
passport.use(PassportStrategy.jwt)
passport.use(PassportStrategy.google)

// Socket
const server = http.createServer(app)
const sio: io.Server = io(server)

sio.on('connection', (socket) => {
  socket.emit('initial', 'connected')

  Movie.watch().on('change', (data) => {
    // issue with mongoose type package
    socket.emit('new movie', (data as any).fullDocument)
  })
})

// Routers
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default server
