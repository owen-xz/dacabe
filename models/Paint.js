const mongoose = require('mongoose')

const PaintSchema = new mongoose.Schema({
  url: { type: String, required: true },
})

module.exports = mongoose.model('Paint', PaintSchema)
