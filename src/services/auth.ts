import User, { UserDocument } from '../models/User'

type Profile = {
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
  sub: string
}

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

const findOrCreate = async (profile: Profile): Promise<UserDocument> => {
  const {
    sub: googleId,
    email,
    given_name: givenName,
    family_name: familyName,
    picture,
  } = profile
  //**In case the user already registered with email by local strategy */
  //**We will search by email also */
  const user = await User.findOne({ $or: [{ googleId }, { email }] }).populate(
    'favMovie'
  )

  if (!user) {
    const newUser = new User({
      googleId: googleId,
      firstName: givenName,
      lastName: familyName,
      email: email,
      photo: picture,
      isAdmin: email === 'nguyenduy010798@gmail.com',
    })

    await newUser.save()
    return newUser
  }

  user.photo = picture
  return user.save()
}

export default {
  create,
  findUserByEmail,
  findUserById,
  findOrCreate,
}
