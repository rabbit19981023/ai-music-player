import mongoose, { Schema, Model, Document } from 'mongoose'

// design our schema for songs data
const SongSchema: Schema = new Schema({
  data: JSON,
  status: String
})

// compiling our schema to a Data Model
const SongModel: Model<Song> = mongoose.model('songs', SongSchema)

type songData = {
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
  data: songData,
  status: string
}

const findOne = async function (filter: JSON): Promise<Song> {
  return new Promise(async (resolve, reject) => {
    try {
      const song = await SongModel.findOne(filter)
      resolve(song)
    } catch (err) {
      reject(err)
    }
  })
}

const add = function (song: songData): Promise<Song> {
  return new Promise(async (resolve, reject) => {
    try {
      const existSong = await SongModel.findOne({
        song_name: song.song_name
      })

      if (existSong === null) {
        const newSong: Song = new SongModel({
          data: song,
          status: 'Done'
        })
  
        const songDoc = await newSong.save()
        resolve(songDoc)
      }
    } catch (err) {
      reject(err)
    }
  })
}

export default {
  findOne: findOne,
  add: add
}
