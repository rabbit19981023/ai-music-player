import mongoose, { Schema, Model, Document } from 'mongoose'

interface Song extends Document {
  data: JSON
}

// design our schema for songs data
const SongSchema: Schema = new Schema({
  data: JSON
})

// compiling our schema to a Data Model
const SongModel: Model<Song> = mongoose.model('songs', SongSchema)

export default SongModel
