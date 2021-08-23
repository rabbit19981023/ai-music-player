/** NPM Modules **/
import express from 'express'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'

/** Custom Libraries **/
import db from './config/db'

/** Routes **/
import apiRoute from './routes/api.route'
import musicPlayerRoute from './routes/musicPlayer.route'
import uploadRoute from './routes/upload.route'

/** Main Express App **/
class Server {
  public app: express.Application

  /** Initializer **/
  constructor () {
    this.app = express()
    this.config()
    this.registerRoutes()
    this.connectDb()
  }

  /** App Settings **/
  private config (): void {
    const app: express.Application = this.app

    dotenv.config()

    app.use(morgan('dev'))
    app.use(express.static(path.resolve(__dirname, '../assets'))) // serve css/imgs/fonts files
    app.use(express.static(path.resolve(__dirname, '../assets/html'))) // serve html files
    app.use(express.static(path.resolve(__dirname, './assets'))) // serve js files
    app.use(express.json())
    app.use(express.urlencoded({ extended: true })) // parsing form data
  }

  /** routes **/
  private registerRoutes (): void {
    const app: express.Application = this.app

    app.use('/v1/api', apiRoute)
    app.use('/', musicPlayerRoute)
    app.use('/', uploadRoute)
  }

  /** db connecting **/
  private connectDb (): void {
    db.connect()
  }
}

const app: express.Application = new Server().app

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`The Server is running at PORT:${PORT}......`))
