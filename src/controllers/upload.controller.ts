import { Request, Response } from 'express'
import path from 'path'

export default {
  // GET '/add-train-data'
  addTrainData: function (req: Request, res: Response): void {
    res.sendFile(path.resolve(__dirname, '../../assets/html/add-train-data.html'))
  },

  // GET '/add-music'
  addMusic: function (req: Request, res: Response): void {
    res.sendFile(path.resolve(__dirname, '../../assets/html/add-music.html'))
  },

  // GET '/change-music-data'
  changeMusicData: function (req: Request, res: Response): void {
    res.sendFile(path.resolve(__dirname, '../../assets/html/change-music-data.html'))
  }
}
