import mongoose, { Schema, Model, Document } from 'mongoose'

export type SongData = {
  song_name: string,
  type: string,
  genre: string,
  singer: string,
  bpm: string | number, // FormData: string, DataField: number
  tone: string,
  media_url: string,
  youtube_thumbnail: string,
  path: string,
  nlp_psg: [list: string[]],
  keywords: string[], // Generate from 'POST /v1/api/songs' API
  status: string
}

export interface Song extends Document {
  data: SongData,
  status: string
}

// design our schema for songs data
const SongSchema: Schema = new Schema({
  data: JSON,
  status: String
})

// compiling our schema to a Data Model
const SongModel: Model<Song> = mongoose.model('songs', SongSchema)

const find = async function (filter: object): Promise<Song[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const songs: Song[] = await SongModel.find(filter)
      resolve(songs)
    } catch (err) { reject(err) }
  })
}

const findOne = async function (filter: object): Promise<Song | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const song: Song | null = await SongModel.findOne(filter)
      resolve(song)
    } catch (err) { reject(err) }
  })
}

const add = async function (song: SongData): Promise<Song | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const existSong: Song | null = await SongModel.findOne({
        "data.song_name": song.song_name
      })

      if (existSong === null) {
        const newSong: Song = new SongModel({
          data: song,
          status: 'Done'
        })

        const songDoc: Song = await newSong.save()
        resolve(songDoc)
        return
      }

      resolve(null)
    } catch (err) { reject(err) }
  })
}

export default {
  find: find,
  findOne: findOne,
  add: add
}
