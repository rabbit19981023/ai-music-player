import { Request, Response } from 'express'
import { UpdateWriteOpResult } from 'mongoose'
import fetch from 'node-fetch'

import SongModel, { SongData, SongDoc } from '../models/songs'

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

      // Get origin Songs
      const songs: SongDoc[] = await SongModel.find(filter)

      // if '/v1/api/songs?order=<any value>' is set, directly return song-list without shuffle
      if (req.query.order) {
        res.json(songs)
        return
      }

      /** 亂數排序演算法: Fisher-Yates Shuffle (結果呈現"均勻分配") **/
      const shuffleSongs = function (songs: SongDoc[]) {
        // 從最後一首歌開始跑，一直到第"二"首歌為止
        // 每次迴圈，都讓"目前"的歌跟"前方隨機"一首歌交換位置
        for (let current: number = songs.length - 1; current > 0; current--) {
          const previous: number = Math.floor(Math.random() * (current + 1));

          // Swap current-song and previous-song
          [songs[current], songs[previous]] = [songs[previous], songs[current]]
        }
      }
      shuffleSongs(songs)

      if (songNumbers) {
        if (songs.length < songNumbers) {
          res.json(songs)
          return
        }

        const songsList = []
        for (let i = 0; i < songNumbers; i++) {
          songsList.push(songs[i])
        }

        res.json(songsList)
        return
      }

      res.json(songs)
    } catch (err) { res.json({ status: 'Server Error' }) }
  },

  // POST '/v1/api/songs'
  addSong: async function (req: Request, res: Response): Promise<void> {
    const song: SongData = JSON.parse(req.body.song_data)

    // Re-generate SongData.bpm
    song.bpm = parseInt(song.bpm as string) // parsing string to number, to make number comparison possible

    // Generate SongData.keywords
    const keywords: string[] = []
    for (let list in song.nlp_psg) {
      for (let i in song.nlp_psg[list]) {
        keywords.push(song.nlp_psg[list][i])
      }
    }
    song.keywords = keywords

    // Generate SongData.youtube_thumbnail
    const url: string = song.media_url
    let id: string = 'id-not-find'
    if (url.includes('?v=')) {
      id = url.split('?v=')[1]
    }
    if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1]
    }
    song.youtube_thumbnail = `https://i.ytimg.com/vi/${id}/sddefault.jpg`

    try {
      const result: SongDoc | null = await SongModel.addOne(song)

      if (result) {
        res.json({ status: 'Done' })
        return
      }
      
      res.json({ status: 'Error' })
    } catch (err) { res.json({ status: 'Server Error' }) }
  },

  // PATCH '/v1/api/songs'
  updateSong: async function (req: Request, res: Response): Promise<void> {
    const song: SongDoc["data"] = req.body.song_data
    const filter = { "data.song_name": song.song_name }

    type Updates = {
      "data.type": string,
      "data.tone": string,
      "data.bpm": number
    }
    const updates: Updates = { } as Updates

    try {
      if (song.type) {
        updates["data.type"] = song.type
      }

      if (song.tone) {
        updates["data.tone"] = song.tone
      }

      if (song.bpm) {
        updates["data.bpm"] = parseInt(song.bpm as string)
      }

      const result: UpdateWriteOpResult = await SongModel.updateOne(filter, updates)

      if (result.nModified > 0) {
        res.json({ status: 'Done' })
        return
      }

      res.json({ status: 'Error' })
    } catch (err) { res.json({ status: 'Server Error' }) }
  }
}
