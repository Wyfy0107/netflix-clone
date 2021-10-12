import { Request, Response, NextFunction } from 'express'

import { NotFoundError, InternalServerError } from '../helpers/apiError'
import UserService from '../services/user'

export const addFavMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, movieId } = req.body
    await UserService.add(userId, movieId)
    res.json({ message: 'success' })
  } catch (error) {
    next(new NotFoundError())
  }
}

export const getUserData = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = { ...req.user._doc }
    userData.password = ''

    res.json({ user: userData })
  } catch (error) {
    next(new InternalServerError())
  }
}
