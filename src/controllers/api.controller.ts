import { Request, Response } from 'express'
import fetch from 'node-fetch'

import SongModel, { SongData, Song } from '../models/songs'

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

  // GET '/v1/api/songs'
  getSongs: async function (req: Request, res: Response): Promise<void> {
    type Filter = {
      "data.type": string,
      "data.tone": object,
      "data.keywords": object,
      "data.bpm": object,
    }

    try {
      const songNumbers: number = parseInt(req.query.song_numbers as string)
      const type: string = req.query.type as string
      const tone: string = req.query.tone as string
      let keywords: string | string[] = req.query.keywords as string
      const minSpeed: number = parseInt(req.query.min_speed as string)
      const maxSpeed: number = parseInt(req.query.max_speed as string)

      const filter: Filter = { } as Filter

      if (type) {
        filter["data.type"] = type
      }

      if (tone) {
        const tones: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const index: number = parseInt(tone)

        const pattern: string = `${tones[index]},` // be aware of ',' !!
        const regex: RegExp = new RegExp(pattern, 'g')

        filter["data.tone"] = {
          $regex: regex
        }
      }

      if (keywords) {
        keywords = keywords.split(' ')

        filter["data.keywords"] = {
          $in: keywords
        }
      }

      if (minSpeed && maxSpeed) {
        filter["data.bpm"] = {
          $gte: minSpeed,
          $lte: maxSpeed
        }
      }

      const songs: Song[] = await SongModel.find(filter)

      // Generate "random" Hymns List depends on "song_numbers"
      if (songNumbers) {
        // randomSet.size == song_numbers
        // randomSet.item <= Song[].length - 1 (0 ~ length-1)
        const getRandomSet = function (songNumbers: number): Set<number> {
          const getRandomNum = function (maxNumber: number): number {
            return Math.floor(Math.random() * maxNumber)
          }

          const randomSet: Set<number> = new Set()
          while (randomSet.size < songNumbers) {
            randomSet.add(getRandomNum(songs.length))
          }
          return randomSet
        }

        if (songs.length < songNumbers) {
          res.json(songs)
        } else {
          const randomSet: Set<number> = getRandomSet(songNumbers)
          const newSongs: Song[] = []

          for (let index of randomSet) {
            newSongs.push(songs[index])
          }
          res.json(newSongs)
        }
      } else {
        res.json(songs)
      }
    } catch (err) { res.json({ status: 'Server Error' }) }
  },

  // POST '/v1/api/songs'
  addSong: async function (req: Request, res: Response): Promise<void> {
    const song: SongData = JSON.parse(req.body.song_data)
    song.bpm = parseInt(song.bpm as string) // parsing string to number, to make number comparison possible

    const keywords: string[] = []
    for (let list in song.nlp_psg) {
      for (let i in song.nlp_psg[list] as string[]) {
        keywords.push(song.nlp_psg[list][i] as string)
      }
    }

    song.keywords = keywords

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
