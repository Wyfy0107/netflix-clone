import { UserDocument } from './../models/User'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import AuthService from '../services/auth'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from '../helpers/apiError'

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body

    //**Capitalize first and last name */
    const sanitizeFirstName: string =
      firstName.charAt(0).toUpperCase() + firstName.slice(1)
    const sanitizeLastName: string =
      lastName.charAt(0).toUpperCase() + lastName.slice(1)

    const emailExists = await User.find({ email: email })
    if (emailExists.length !== 0) {
      throw new Error()
    }

    const hashedPassword = await bcrypt.hash(password, 5)

    const newUser = new User({
      firstName: sanitizeFirstName,
      lastName: sanitizeLastName,
      email,
      password: hashedPassword,
      isAdmin: email === 'nguyenduy010798@gmail.com',
    })

    await AuthService.create(newUser)
    res.json({
      status: 200,
      message: 'Registration Success',
    })
  } catch (error) {
    return next(new BadRequestError('Email already exists'))
  }
}

export const googleLogin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserDocument
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '4h' }
  )

  const userSerialized = { ...user }
  userSerialized.password = ''

  res.json({ token, user: userSerialized })
}

//**passport custom callback */
export const localLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', function (error, user, info) {
    if (error) {
      return next(new InternalServerError())
    }
    if (!user) {
      if (info.message === 'Invalid email or password') {
        return next(new UnauthorizedError(info.message))
      }
      return next(new NotFoundError(info.message))
    }
    const userId = user._id
    const token = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '4h' }
    )

    const userSerialized = { ...user._doc }
    userSerialized.password = ''

    res.status(200).json({ user: userSerialized, token })
  })(req, res, next)
}
