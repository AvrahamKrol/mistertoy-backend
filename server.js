import express from 'express'
import path, { dirname } from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Services
import { loggerService } from './services/logger.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public')))
  console.log('__dirname: ', __dirname)
} else {
  // Configuring CORS
  // Make sure origin contains the url
  // your frontend dev-server is running on
  const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

import { toyRoutes } from './api/toy/toy.routes.js'

app.use('/api/toy', toyRoutes)

app.get('/*splat', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`),
)
