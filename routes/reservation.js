const express = require('express')
const router = express.Router()
const {
  getReservation,
  postReservation,
  putReservation,
} = require('../controller/reservationController')

router.get('/reservation/:email', getReservation)
router.post('/reservation', postReservation)
router.put('/reservation/:id', putReservation)

module.exports = router
