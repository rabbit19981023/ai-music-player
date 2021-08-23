import mongoose, { Schema, Model, Document, UpdateWriteOpResult } from 'mongoose'

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

export interface SongDoc extends Document {
  data: SongData,
  status: string
}

// design our schema for songs data
const SongSchema: Schema = new Schema({
  data: JSON,
  status: String
})

// compiling our schema to a Data Model
const SongModel: Model<SongDoc> = mongoose.model('songs', SongSchema)

const find = async function (filter: object): Promise<SongDoc[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const songs: SongDoc[] = await SongModel.find(filter)
      resolve(songs)
    } catch (err) { reject(err) }
  })
}

const findOne = async function (filter: object): Promise<SongDoc | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const song: SongDoc | null = await SongModel.findOne(filter)
      resolve(song)
    } catch (err) { reject(err) }
  })
}

const addOne = async function (song: SongData): Promise<SongDoc | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const existSong: SongDoc | null = await SongModel.findOne({
        "data.song_name": song.song_name
      })

      if (existSong === null) {
        const newSong: SongDoc = new SongModel({
          data: song,
          status: 'Done'
        })

        const songDoc: SongDoc = await newSong.save()
        resolve(songDoc)
        return
      }

      resolve(null)
    } catch (err) { reject(err) }
  })
}

const updateOne = async function (filter: object, updates: object): Promise<UpdateWriteOpResult> {
  return new Promise(async (resolve, reject) => {
    try {
      const result: UpdateWriteOpResult = await SongModel.updateOne(filter, updates)
      resolve(result)
    } catch (err) { reject(err) }
  })
}

export default {
  find: find,
  findOne: findOne,
  addOne: addOne,
  updateOne: updateOne
}
