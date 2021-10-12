import request from 'supertest'

import app from '../../src/app'
import User, { UserDocument } from '../../src/models/User'
import Movie, { MovieDocument } from '../../src/models/Movie'
import UserService from '../../src/services/user'
import AuthService from '../../src/services/auth'
import MovieService from '../../src/services/movie'
import * as dbHelper from '../db-helper'
import { login } from '../controllers/movie.test'

const randomUserId = '5f8f38641e86fe340c44872a'
const randomMovieId = '5f8efcfb4bc06c3d3cdf0aaf'

async function createMovie() {
  let movie = new Movie({
    name: 'Angrybirds 2',
    publishedYear: 2019,
    rating: 3.5,
    duration: 120,
    genres: ['Animation', 'Game'],
    cast: ['Red', 'Chuck', 'Bomb'],
    description: 'abcdefg',
    likedBy: [randomUserId],
    poster: 'abc',
    background: 'abc',
  })

  return await MovieService.create(movie)
}

async function createUser() {
  let user = new User({
    firstName: 'Duy',
    lastName: 'Nguyen',
    email: 'nguyenduy@gmail.com',
    password: 'duynguyen',
  })

  return await AuthService.create(user)
}

describe('user services', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should add a movie to users favorite list and user id to the likedBy property of movie', async () => {
    const movie = await createMovie()
    const user = await createUser()

    const movieId = movie._id
    const userId = user._id

    const res = await UserService.add(userId, movieId)
  })

  it('should remove favorite movie and user id if the same request is sent again', async () => {
    const movie = await createMovie()
    const user = await createUser()

    const movieId = movie._id
    const userId = user._id

    const res1 = await UserService.add(userId, movieId)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const res2 = await UserService.add(userId, movieId)

    expect(res1).toEqual('movie added')
    expect(res2).toEqual('movie removed')
  })

  it('should not add favorite movie if userId or movieId does not exist', async () => {
    try {
      await UserService.add(randomUserId, randomMovieId)
    } catch (error) {
      expect(error.message).toEqual('User not found')
    }
  })
})
