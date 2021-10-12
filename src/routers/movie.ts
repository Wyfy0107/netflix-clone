import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  createMovie,
  findById,
  deleteMovie,
  findAll,
  findByName,
  findByGenres,
  updateMovie,
} from '../controllers/movie'
import formValidate from '../middlewares/formValidator'
import adminVerify from '../middlewares/adminVerify'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
//**Query options: latest, limit and page */
router.get('/', findAll)
router.get('/id/:movieId', findById)
router.get('/genres/:movieGenres', findByGenres)
//**Use query string instead of params: /name/movieName={movieName} */
router.get('/name', findByName)

router.put('/update/:movieId', tokenVerify, adminVerify, updateMovie)
router.delete('/delete/:movieId', tokenVerify, adminVerify, deleteMovie)
router.post(
  '/create',
  formValidate.movie,
  tokenVerify,
  adminVerify,
  createMovie
)

export default router
