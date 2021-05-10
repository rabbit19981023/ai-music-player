import mongoose, { Schema, Model, Document } from 'mongoose'

interface Song extends Document {
  data: JSON,
  status: string
}

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
  bpm: string,
  tone: string,
  media_url: string,
  path: string,
  nlp_psg: object,
  status: string
}

const add = function (song: songData): Promise<Song> {
  return new Promise(async (resolve, reject) => {
    try {
      const newSong: Song = new SongModel({
        data: song,
        status: 'Done'
      })

      const songDoc = await newSong.save()
      resolve(songDoc)
    } catch (err) {
      reject(err)
    }
  })
}

export default {
  add: add
}
