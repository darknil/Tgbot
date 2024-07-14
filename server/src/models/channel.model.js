import mongoose from '../db/db.js'
const channleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  channelId: {
    type: String
  }
})
const channel = mongoose.model('channel', channleSchema)
export { channleSchema, channel }
