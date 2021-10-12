import { Request, Response, NextFunction } from 'express'

import { UserDocument } from './../models/User'
import { ForbiddenError } from './../helpers/apiError'

const adminVerify = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as UserDocument

  if (user.isAdmin) {
    return next()
  }

  next(new ForbiddenError())
}

export default adminVerify
