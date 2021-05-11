import { Request, Response } from 'express'
import fetch from 'node-fetch'

import { Document } from 'mongoose'
import SongModel from '../models/songs'

export default {
  // GET '/v1/api/types/all'
  allTypes: async function (req: Request, res: Response): Promise<void> {
    try {
      type ApiData = {
        [i: string]: string
      }

      const result = await fetch('http://163.18.42.232:8000/get_types')
      const types: ApiData = await result.json()

      res.json(types)
    } catch (err) { res.json({ status: 'Server Error' }) }
  },

  // GET '/v1/api/types-with-imgs/all'
  typesWithImgs: async function (req: Request, res: Response): Promise<void> {
    try {
      type ApiData = {
        [i: string]: {
          info: string,
          image: string
        }
      }

      const result = await fetch('http://163.18.42.232:8000/types_img')
      const typesWithImgs: ApiData = await result.json()

      res.json(typesWithImgs)
    } catch (err) { res.json({ status: 'Server Error' }) }
  },

  // GET '/v1/api/tones/all'
  allTones: function (req: Request, res: Response): void {
    const infos: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const images: string[] = [
      '/img/C.png',
      '/img/C.png',
      '/img/D.png',
      '/img/D.png',
      '/img/E.png',
      '/img/F.png',
      '/img/F.png',
      '/img/G.png',
      '/img/G.png',
      '/img/A.png',
      '/img/A.png',
      '/img/B.png',
      '/img/C.png'
    ]

    type Tones = {
      [i: string]: {
        info: string,
        image: string
      }
    }

    const tones: Tones = {}
    for (let i = 0; i < infos.length; i++) {
      tones[i] = {
        info: infos[i],
        image: images[i]
      }
    }

    res.json(tones)
  },

  // POST '/v1/api/songs'
  addSong: async function (req: Request, res: Response): Promise<void> {
    type SongData = {
      song_name: string,
      type: string,
      genre: string,
      singer: string,
      bpm: number,
      tone: string,
      media_url: string,
      path: string,
      nlp_psg: object,
      status: string
    }

    interface Song extends Document {
      data: SongData,
      status: string
    }

    const song: SongData = JSON.parse(req.body.song_data)

    try {
      const result: Song | null = await SongModel.add(song)

      if (result) {
        res.json({ status: 'Done' })
      } else {
        res.json({ status: 'Error' })
      }
    } catch (err) { res.json({ status: 'Server Error' }) }
  }
}
