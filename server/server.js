// imports dependencies
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

// local file dependencies
import router from './routes.js'
import mongoose from 'mongoose'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()


mongoose.connect(process.env.URI_TO_CONNECT_MONGODB);

const connection = mongoose.connection;

connection
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', listen);

function listen () {
  if (app.get('env') === 'test') return;
  app.listen(process.env.PORT, () => {
	console.log('Server is running on ', process.env.PORT)
})
}

// middlewares
app.use(cors())
app.use(express.json({ type: 'application/json' }))
app.use(morgan('dev'))
app.use(helmet({ contentSecurityPolicy: false }))

// serve the static pages
app.use(express.static(path.join(__dirname, '../public/dist')))

// different routes
app.use('/services', router)

