const mongoose = require('mongoose')
const { statusEnum } = require('../enums/orderEnum')

const OrderSchema = new mongoose.Schema({
  cart: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Products',
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  orderer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  note: { type: String },
  reservedTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: statusEnum,
    required: true,
    default: '待確認',
  },
})

module.exports = mongoose.model('Order', OrderSchema)
