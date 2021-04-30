import { Request, Response } from 'express'
import path from 'path'

export default {
  // GET '/add-train-data'
  addTrainData: function (req: Request, res: Response): void {
    return res.sendFile(path.resolve(__dirname, '../../assets/html/add-train-data.html'))
  },

  // GET '/add-music'
  addMusic: function (req: Request, res: Response): void {
    return res.sendFile(path.resolve(__dirname, '../../assets/html/add-music.html'))
  }
}
