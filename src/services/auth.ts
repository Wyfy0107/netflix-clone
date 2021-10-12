import User, { UserDocument } from '../models/User'

const create = (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ email }).populate('favMovie')
  return user
}

const findUserById = async (id: string): Promise<UserDocument | null> => {
  const user = await User.findById(id).populate('favMovie')

  return user
}

const findOrCreate = async (profile: any): Promise<UserDocument> => {
  const googleId = profile.id
  const email = profile.emails[0].value
  //**In case the user already registered with email by local strategy */
  //**We will search by email also */
  const user = await User.findOne({ $or: [{ googleId }, { email }] }).populate(
    'favMovie'
  )

  if (!user) {
    const newUser = new User({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
      isAdmin: profile.emails[0].value === 'nguyenduy010798@gmail.com',
    })

    newUser.save()
    return newUser
  }

  user.photo = profile.photos[0].value
  return user.save()
}

export default {
  create,
  findUserByEmail,
  findUserById,
  findOrCreate,
}
