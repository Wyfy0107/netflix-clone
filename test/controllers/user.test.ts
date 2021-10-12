import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import { MovieDocument } from '../../src/models/Movie'
import app from '../../src/app'
import * as dbHelper from '../db-helper'
import { createAndLogin } from './movie.test'

const randomUserId = '5e57b77b5744fa0b461'
const randomMovieId = '5f8efcfb4bc06c3d3cdf0aaf'

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    firstName: 'Duy',
    lastName: 'Nguyen',
    email: 'nguyenduy@gmail.com',
    password: 'duynguyen',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/auth/register').send(user)
}

async function createMovie(override?: Partial<MovieDocument>) {
  let movie = {
    name: 'Angrybirds 2',
    publishedYear: 2019,
    rating: 3.5,
    duration: 120,
    genres: ['Animation', 'Game'],
    cast: ['Red', 'Chuck', 'Bomb'],
    description: 'abcdefg',
    likedBy: ['abc'],
  }

  const token = await createAndLogin()

  if (override) {
    movie = { ...movie, ...override }
  }

  return await request(app)
    .post('/api/v1/movies/create')
    .set('Authorization', token)
    .send(movie)
}

describe('auth controller', () => {
  beforeAll(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should add a movie to users favorite list', async () => {
    const movie = await createMovie()
    const token = await createAndLogin()
    const userData = await request(app)
      .get('/api/v1/user/data')
      .set('Authorization', token)

    expect(userData.status).toBe(200)
    expect(movie.status).toBe(200)

    const userId = userData.body.user._id
    const movieId = movie.body._id

    const body = {
      userId,
      movieId,
    }

    const res = await request(app)
      .put('/api/v1/user/add-fav')
      .set('Authorization', token)
      .send(body)
    const movieQuery = await request(app)
      .get(`/api/v1/movies/id/${movieId}`)
      .set('Authorization', token)

    expect(res.body.message).toEqual('success')
    expect(movieQuery.body.likedBy[0]).toEqual({
      firstName: userData.body.user.firstName,
      lastName: userData.body.user.lastName,
    })
  })

  it('should response 404 if using a non-existing movieId', async () => {
    await createUser()
    await createMovie()
    const token = await createAndLogin()
    const userData = await request(app)
      .get('/api/v1/user/data')
      .set('Authorization', token)

    const body = {
      userId: userData.body.user._id,
      movieId: randomMovieId,
    }

    const res = await request(app)
      .put('/api/v1/user/add-fav')
      .set('Authorization', token)
      .send(body)

    expect(res.status).toBe(404)
  })

  it('should get a user data', async () => {
    const token = await createAndLogin()

    const res = await request(app)
      .get(`/api/v1/user/data`)
      .set('Authorization', token)

    expect(res.status).toBe(200)
  })
})
