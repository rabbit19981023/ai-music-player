import mongoose, { Schema, Model, Document } from 'mongoose'

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

// design our schema for songs data
const SongSchema: Schema = new Schema({
  data: JSON,
  status: String
})

// compiling our schema to a Data Model
const SongModel: Model<Song> = mongoose.model('songs', SongSchema)

const findOne = async function (filter: JSON): Promise<Song | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const song: Song | null = await SongModel.findOne(filter)
      resolve(song)
    } catch (err) { reject(err) }
  })
}

const add = function (song: SongData): Promise<Song | null> {
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
      } else {
        resolve(null)
      }
    } catch (err) { reject(err) }
  })
}

export default {
  findOne: findOne,
  add: add
}
