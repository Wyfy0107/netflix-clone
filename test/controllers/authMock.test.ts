import request from 'supertest'
import { NextFunction } from 'express'
import * as dbHelper from '../db-helper'
import app from '../../src/app'

jest.mock(
  '../../src/middlewares/tokenVerify',
  () => (req: Request, res: Response, next: NextFunction) => next()
)

describe('movie controller', () => {
  beforeAll(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
    afterEach(() => {
      jest.resetAllMocks
      jest.restoreAllMocks()
    })
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should not create a movie with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/movies/create')
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
})
