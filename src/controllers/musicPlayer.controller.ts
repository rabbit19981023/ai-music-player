import { Request, Response } from 'express'
import path from 'path'

export default {
  // GET '/music-player'
  musicPlayer: function (req: Request, res: Response): void {
    res.sendFile(path.resolve(__dirname, '../../assets/html/music-player.html'))
  }
}
