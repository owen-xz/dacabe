const mongoose = require('mongoose')
const { statusEnum } = require('../enums/reservationEnum')

const ReservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  note: { type: String, default: '' },
  reservedTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: statusEnum,
    required: true,
    default: 'unreported',
  },
})

module.exports = mongoose.model('Reservation', ReservationSchema)
