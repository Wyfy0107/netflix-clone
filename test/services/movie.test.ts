import Movie from '../../src/models/Movie'
import User from '../../src/models/User'
import MovieService from '../../src/services/movie'
import AuthService from '../../src/services/auth'
import * as dbHelper from '../db-helper'

const nonExistingMovieId = '5e57b77b5744fa0b461c7906'

async function createMovie() {
  const movie = new Movie({
    name: 'Shrek 3',
    publishedYear: 2011,
    genres: ['Animation'],
    duration: 90,
    description: 'abc',
    cast: ['Shrek', 'Fiona'],
  })
  return await MovieService.create(movie)
}

async function createUser() {
  let user = new User({
    googleId: '5e57b77b5744fa0b461c7906',
    firstName: 'Duy',
    lastName: 'Nguyen',
    email: 'nguyenduy@gmail.com',
    password: 'duynguyen',
  })

  return await AuthService.create(user)
}

describe('movie service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a movie', async () => {
    const movie = await createMovie()
    expect(movie).toHaveProperty('_id')
    expect(movie).toHaveProperty('name', 'Shrek 3')
    expect(movie).toHaveProperty('duration', 90)
  })

  it('should get a movie with id', async () => {
    const movie = await createMovie()
    const found = await MovieService.findById(movie._id)
    expect(found.name).toEqual(movie.name)
    expect(found._id).toEqual(movie._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing movie', async () => {
    expect.assertions(1)
    return MovieService.findById(nonExistingMovieId).catch((e) => {
      expect(e.message).toMatch(`Movie ${nonExistingMovieId} not found`)
    })
  })

  it('should update an existing movie', async () => {
    const movie = await createMovie()
    const update = {
      name: 'Batman',
      publishedYear: 2020,
      duration: 200,
      description: 'abcd',
      cast: ['duy'],
      genres: ['Anime'],
    }
    const updated = await MovieService.update(movie._id, update)
    expect(updated).toHaveProperty('_id', movie._id)
    expect(updated.name).toEqual(update.name)
    expect(updated).toHaveProperty('publishedYear', 2020)
    expect(updated).toHaveProperty('duration', 200)
    expect(updated).toHaveProperty('description', 'abcd')
    expect(updated.cast[0]).toEqual('duy')
    expect(updated.genres[0]).toEqual('Anime')
  })

  it('should not update a non-existing movie', async () => {
    expect.assertions(1)
    const update = {
      name: 'Shrek',
      publishedYear: 2001,
    }
    return MovieService.update(nonExistingMovieId, update).catch((e) => {
      expect(e.message).toMatch(`Movie ${nonExistingMovieId} not found`)
    })
  })

  it('should delete an existing movie', async () => {
    expect.assertions(1)
    const movie = await createMovie()
    await MovieService.deleteMovie(movie._id)
    return MovieService.findById(movie._id).catch((e) => {
      expect(e.message).toBe(`Movie ${movie._id} not found`)
    })
  })

  it('should get back movies by name', async () => {
    const movie = await createMovie()
    const movieName = movie.name

    const data = await MovieService.findByName(movieName)
    console.log(data[0].name)
    expect(data[0].name).toEqual(movie.name)
  })

  it('should not get back non-existing movies by name', async () => {
    try {
      await createMovie()
      await MovieService.findByName('abc')
    } catch (error) {
      expect(error.message).toEqual('Movie abc not found')
    }
  })

  it('should get back movies by genres', async () => {
    const movie = await createMovie()
    const movieGenres = movie.genres

    const data = await MovieService.findByGenres(movieGenres[0])
    expect(data[0].name).toEqual(movie.name)
  })

  it('should not get back movies with non-existing genres', async () => {
    try {
      await createMovie()
      const randomGenres = 'abcd'

      await MovieService.findByGenres(randomGenres)
    } catch (error) {
      expect(error.message).toEqual('No movie matches abcd genres')
    }
  })

  it('should get back all movies', async () => {
    const movie = await createMovie()
    const option = {}

    const data = await MovieService.findAll(option)
    expect(data[0]._id).toEqual(movie._id)
  })

  it('should not get back any movies if database is empty', async () => {
    try {
      await MovieService.findAll({})
    } catch (error) {
      expect(error.message).toEqual('Database is empty')
    }
  })
})
