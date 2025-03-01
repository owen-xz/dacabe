const mongoose = require('mongoose')
const { categoryEnum } = require('../enums/productEnum')

const ProductsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  photos: { type: Array, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: categoryEnum, required: true },
})

module.exports = mongoose.model('Products', ProductsSchema)
