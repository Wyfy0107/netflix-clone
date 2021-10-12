import { Request, Response, NextFunction } from 'express'

import { BadRequestError } from '../helpers/apiError'

import validator from 'validator'

const register = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body

  const emailCheck = validator.isEmail(email)
  const passwordCheck = validator.isLength(password, { min: 6 })
  const firstNameCheck = validator.isEmpty(firstName)
  const lastNameCheck = validator.isEmpty(lastName)

  if (!emailCheck) {
    return next(new BadRequestError('Email is invalid'))
  }
  if (!passwordCheck) {
    return next(
      new BadRequestError('Password must contain at least 6 characters')
    )
  }
  if (firstNameCheck) {
    return next(new BadRequestError('First name is required'))
  }
  if (lastNameCheck) {
    return next(new BadRequestError('Last name is required'))
  }

  return next()
}

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  const emailCheck = validator.isEmail(email)
  const passwordCheck = validator.isLength(password, { min: 6 })

  if (!emailCheck) {
    return next(new BadRequestError('Email is invalid'))
  }
  if (!passwordCheck) {
    return next(
      new BadRequestError('Password must contain at least 6 characters')
    )
  }

  return next()
}

const movie = (req: Request, res: Response, next: NextFunction) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      const check = validator.isEmpty(req.body[key])

      if (check) return next(new BadRequestError(`${key} is missing`))
    }
  }

  return next()
}

export default { register, login, movie }
