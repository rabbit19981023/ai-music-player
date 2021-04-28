import mongoose from 'mongoose'

export default {
  connect: async function () {
    try {
      await mongoose.connect(process.env.MONGODB_URI || '', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })

      console.log('Connecting to database successfully!')
    } catch (err) { }
  }
}
