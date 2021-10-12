import { Request, Response, NextFunction } from 'express'

import Movie from '../models/Movie'
import MovieService from '../services/movie'

import { NotFoundError, BadRequestError } from '../helpers/apiError'

// POST /movies
export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      publishedYear,
      genres,
      duration,
      cast,
      poster,
      background,
    } = req.body

    const movie = new Movie({
      name,
      description,
      publishedYear,
      genres,
      duration,
      cast,
      poster,
      background,
    })

    res.json(await MovieService.create(movie))
  } catch (error) {
    next(new BadRequestError('Invalid Request', error))
  }
}

// PUT /movies/:movieId
export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const movieId = req.params.movieId
    const updatedMovie = await MovieService.update(movieId, update)
    res.json(updatedMovie)
  } catch (error) {
    next(new NotFoundError('Movie not found', error))
  }
}

// DELETE /movies/:movieId
export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await MovieService.deleteMovie(req.params.movieId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Movie not found', error))
  }
}

// GET /movies/id/:movieId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await MovieService.findById(req.params.movieId))
  } catch (error) {
    next(new NotFoundError('Movie not found', error))
  }
}

//**GET /movies/name?movieName={name} */
export const findByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryString = req.query.movieName

    res.json(await MovieService.findByName(queryString as string))
  } catch (error) {
    next(new NotFoundError('Movie not found', error))
  }
}

//**GET /movies/genres/:movieGenres */
export const findByGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(await MovieService.findByGenres(req.params.movieGenres))
  } catch (error) {
    next(new NotFoundError('Movie not found', error))
  }
}

// GET /movies
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const option = {
      latest: parseInt(req.query.latest as string),
      limit: parseInt(req.query.limit as string),
      page: parseInt(req.query.page as string),
    }
    res.json(await MovieService.findAll(option))
  } catch (error) {
    console.log('error', error)
    next(new NotFoundError('Movies not found', error))
  }
}
