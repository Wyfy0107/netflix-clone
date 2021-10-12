import request from 'supertest'

import { MovieDocument } from '../../src/models/Movie'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingMovieId = '5e57b77b5744fa0b461'

async function createMovie(override?: Partial<MovieDocument>) {
  let movie = {
    name: 'Angrybirds 2',
    publishedYear: 2019,
    rating: 3.5,
    duration: 120,
    genres: ['Animation', 'Game'],
    cast: ['Red', 'Chuck', 'Bomb'],
    description: 'abcdefg',
  }

  const formatToken = await createAndLogin()

  if (override) {
    movie = { ...movie, ...override }
  }

  return await request(app)
    .post('/api/v1/movies/create')
    .set('Authorization', formatToken)
    .send(movie)
}

export async function createUser() {
  let user = {
    firstName: 'Duy',
    lastName: 'Nguyen',
    email: 'nguyenduy@gmail.com',
    password: 'duynguyen',
  }

  return await request(app).post('/api/v1/auth/register').send(user)
}

export async function login(email: string, password: string) {
  const body = { email, password }
  return await request(app).post('/api/v1/auth/login/local').send(body)
}

export async function createAndLogin() {
  await createUser()
  const response = await login('nguyenduy@gmail.com', 'duynguyen')
  const token = response.body.token
  const formatToken = `Bearer ${token}`

  return formatToken
}

describe('movie controller', () => {
  beforeAll(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a movie', async () => {
    const res = await createMovie()

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Angrybirds 2')
  })

  it('should not create a movie with wrong data', async () => {
    const token = await createAndLogin()
    const res = await request(app)
      .post('/api/v1/movies/create')
      .set('Authorization', token)
      .send({
        name: 'Angrybirds 2',
        publishedYear: 2019,
        // These fields should be included
        // rating: 3.5,
        // duration: 120,
        genres: ['Animation', 'Game'],
        cast: ['Red', 'Chuck', 'Bomb'],
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing movie', async () => {
    const token = await createAndLogin()
    let res = await createMovie()
    expect(res.status).toBe(200)

    const movieId = res.body._id
    let apiRes = await request(app)
      .get(`/api/v1/movies/id/${movieId}`)
      .set('Authorization', token)

    expect(apiRes.body).toEqual(res.body)
  })

  it('should not get back a non-existing movie', async () => {
    const token = await createAndLogin()
    const res = await request(app)
      .get(`/api/v1/movies/id/${nonExistingMovieId}`)
      .set('Authorization', token)

    expect(res.status).toBe(404)
    expect(res.body.message).toEqual('Movie not found')
  })

  it('should get back all movie', async () => {
    const token = await createAndLogin()

    const movie1 = await createMovie({
      name: 'Angrybirds 1',
      publishedYear: 2016,
    })
    const movie2 = await createMovie({
      name: 'Angrybirds 2',
      publishedYear: 2019,
    })

    const result = await request(app)
      .get(`/api/v1/movies`)
      .set('Authorization', token)

    expect(result.body.length).toEqual(2)
    expect(result.body[0]._id).toEqual(movie1.body._id)
    expect(result.body[1]._id).toEqual(movie2.body._id)
  })

  it('should response with 404 if movie database is empty', async () => {
    const token = await createAndLogin()
    const res = await request(app)
      .get('/api/v1/movies')
      .set('Authorization', token)

    expect(res.status).toBe(404)
  })

  it('should update an existing movie', async () => {
    let res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)

    const movieId = res.body._id
    const update = {
      name: 'Angrybirds 1',
      publishedYear: 2016,
    }

    res = await request(app)
      .put(`/api/v1/movies/update/${movieId}`)
      .set('Authorization', token)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('Angrybirds 1')
    expect(res.body.publishedYear).toEqual(2016)
  })

  it('should response with status 404 if update a non-existing movie', async () => {
    let res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)

    const update = {
      name: 'Angrybirds 1',
      publishedYear: 2016,
    }

    res = await request(app)
      .put(`/api/v1/movies/update/${nonExistingMovieId}`)
      .set('Authorization', token)
      .send(update)

    expect(res.status).toEqual(404)
    expect(res.body.message).toEqual('Movie not found')
  })

  it('should delete an existing movie', async () => {
    let res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)
    const movieId = res.body._id

    res = await request(app)
      .delete(`/api/v1/movies/delete/${movieId}`)
      .set('Authorization', token)

    expect(res.status).toEqual(204)
  })

  it('should get back movies by genres', async () => {
    const res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)

    const query = await request(app)
      .get(`/api/v1/movies/genres/Animation`)
      .set('Authorization', token)

    expect(query.status).toBe(200)
    expect(query.body[0]).toEqual(res.body)
  })

  it('should response with 404 if find movie by non-existing genres', async () => {
    const res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)
    const randomGenres = 'abc'

    const query = await request(app)
      .get(`/api/v1/movies/genres/${randomGenres}`)
      .set('Authorization', token)

    expect(query.status).toBe(404)
  })

  it('should get back movies by name', async () => {
    const res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)
    const { name } = res.body

    const query = await request(app)
      .get(`/api/v1/movies/name?movieName=${name}`)
      .set('Authorization', token)

    expect(query.status).toBe(200)
    expect(query.body[0]).toEqual(res.body)
  })

  it('should response with 404 if find movie by non-existing name', async () => {
    const res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)

    const randomName = 'abc'
    const query = await request(app)
      .get(`/api/v1/movies/name?movieName=${randomName}`)
      .set('Authorization', token)

    expect(query.body.length).toEqual(0)
  })

  it('should not delete a non-existing movie', async () => {
    let res = await createMovie()
    const token = await createAndLogin()
    expect(res.status).toBe(200)

    res = await request(app)
      .delete(`/api/v1/movies/delete/${nonExistingMovieId}`)
      .set('Authorization', token)

    expect(res.status).toBe(404)
    expect(res.body.message).toEqual('Movie not found')
  })

  it('should response with 400 status code when create movie with missing data', async () => {
    const movie = {
      name: 'duy',
    }
    const token = await createAndLogin()

    const res = await request(app)
      .post('/api/v1/movies/create')
      .send(movie)
      .set('Authorization', token)

    expect(res.status).toBe(400)
    expect(res.body.message).toEqual('Invalid Request')
  })
})
