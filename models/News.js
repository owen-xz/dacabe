const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  photos: { type: Array, required: true },
  createdAt: { type: String, required: true },
})

module.exports = mongoose.model('News', NewsSchema)
