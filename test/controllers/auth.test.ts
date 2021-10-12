import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

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

  it('should create a new user', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
  })

  it('should response with 400 if create user with missing data', async () => {
    const res = await createUser({ firstName: '' })

    expect(res.status).toBe(400)
  })

  it('should not make new user if register email already exists', async () => {
    const res1 = await createUser()
    const res2 = await createUser()

    expect(res2.status).toBe(400)
    expect(res2.body.message).toEqual('Email already exists')
  })

  it('should login a user', async () => {
    await createUser()
    const loginForm = {
      email: 'nguyenduy@gmail.com',
      password: 'duynguyen',
    }

    const res = await request(app)
      .post('/api/v1/auth/login/local')
      .send(loginForm)

    expect(res.status).toBe(200)
  })

  it('should fail if email not found', async () => {
    await createUser()
    const loginForm = {
      email: 'abc@gmail.com',
      password: 'duynguyen',
    }

    const res = await request(app)
      .post('/api/v1/auth/login/local')
      .send(loginForm)

    expect(res.status).toBe(404)
    expect(res.body.message).toEqual('Email abc@gmail.com not found')
  })

  it('should fail if password is wrong', async () => {
    await createUser()
    const loginForm = {
      email: 'nguyenduy@gmail.com',
      password: 'duynguyen123',
    }

    const res = await request(app)
      .post('/api/v1/auth/login/local')
      .send(loginForm)

    expect(res.status).toBe(401)
    expect(res.body.message).toEqual('Invalid email or password')
  })
})
