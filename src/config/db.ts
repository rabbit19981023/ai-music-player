import mongoose from 'mongoose'

export default {
  connect: async function (): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'Not Find URI in ENV !!', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })

      console.log('Connecting to database successfully!')
    } catch (err) { }
  }
}
