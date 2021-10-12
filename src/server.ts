import app from './app'
import { isProd } from './util/secrets'
//Now the app is a socket server

const PORT = process.env.PORT || 3000
const ENVIRONMENT = isProd ? 'production' : 'development'

/**
 * Start Express server.
 */
const server = app.listen(PORT, () => {
  console.log(
    `  App is running at http://localhost:${PORT} in ${ENVIRONMENT} mode`
  )
  console.log('  Press CTRL-C to stop\n')
})

export default server
