import User from '../../src/models/User'
import Movie from '../../src/models/Movie'
import MovieService from '../../src/services/movie'
import AuthService from '../../src/services/auth'
import * as dbHelper from '../db-helper'

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

function createGoogleResponse() {
  let profile = {
    id: '5e57b77b5744fa0b461c7906',
    name: { familyName: 'nguyen', givenName: 'Duy' },
    emails: [{ value: 'nguyenduy@gmail.com' }],
    photos: [{ value: 'abc.jpg' }],
  }

  return profile
}

describe('auth services', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('create a new user', async () => {
    const user = await createUser()

    expect(user).toHaveProperty('_id')
    expect(user.firstName).toEqual('Duy')
  })

  it('should find a user by email', async () => {
    const user = await createUser()
    const email = user.email

    const res = await AuthService.findUserByEmail(email)

    if (res) {
      expect(res._id).toEqual(user._id)
    }
  })

  it('should response with 404 if no user is found', async () => {
    try {
      await createUser()
      await AuthService.findUserByEmail('abc@gmail.com')
    } catch (error) {
      expect(error.message).toEqual('Email not found')
    }
  })

  it('should create new user after google login', async () => {
    const profile = createGoogleResponse()
    const res = await AuthService.findOrCreate(profile)

    expect(res.googleId).toEqual(profile.id)
    expect(res.email).toEqual(profile.emails[0].value)
  })

  it('should return a user if user is already registered after google login', async () => {
    const profile = createGoogleResponse()
    const user = await createUser()
    const res = await AuthService.findOrCreate(profile)

    expect(res.googleId).toEqual(user.googleId)
  })

  it('find a user by id', async () => {
    const user = await createUser()
    const res = await AuthService.findUserById(user._id)

    if (res) {
      expect(res._id).toEqual(user._id)
    }
  })
})
