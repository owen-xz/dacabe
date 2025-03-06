const Reservation = require('../models/Reservation')
const { statusEnum } = require('../enums/reservationEnum')

const updateReservationStatus = async (email) => {
  const nowDate = new Date()
  await Reservation.updateMany(
    {
      email,
      status: 'unreported',
      reservedTime: { $lt: nowDate },
    },
    { $set: { status: 'cancelled' } }
  )
}

// 取得未報到之訂位
const getReservation = async (req, res) => {
  try {
    // 判斷必填
    const { email } = req.params
    if (!email) {
      return res.status(400).json({ message: 'Miss required.' })
    }

    // 更新訂位狀態
    await updateReservationStatus(email)

    const reservation = await Reservation.findOne({
      email,
      status: 'unreported',
    })
    return res.status(200).json(reservation)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 新增訂位
const postReservation = async (req, res) => {
  try {
    // 判斷必填
    const { name, phone, email, note, reservedTime } = req.body
    if (!name || !phone || !email || !reservedTime) {
      return res.status(400).json({ message: 'Miss required.' })
    }

    // 判斷訂位時間是否正確
    if (new Date(reservedTime) < new Date()) {
      return res.status(400).json({ message: '不可預訂過去時間' })
    }

    // 更新訂位狀態
    await updateReservationStatus(email)

    // 判斷是否已有尚未報到之訂位
    const reservationExist = await Reservation.findOne({
      email,
      status: 'unreported',
    }).exec()
    if (reservationExist) {
      return res.status(400).send({ message: '尚有未報到之訂位' })
    }

    //新增訂位
    new Reservation({
      name,
      phone,
      email,
      note,
      reservedTime,
    }).save()
    return res.status(200).json({ message: '新增訂位成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 更新訂位狀態
const putReservation = async (req, res) => {
  try {
    // 判斷必填
    const { id } = req.params
    const { status } = req.body
    if (!id || !status) {
      return res.status(400).json({ message: 'Miss required.' })
    }

    // 判斷是否有此 status
    if (!statusEnum.includes(status)) {
      return res.status(400).json({ message: 'status 錯誤' })
    }

    // 更新狀態
    await Reservation.findOneAndUpdate({ _id: id }, { $set: { status } })
    return res.status(200).json({ message: '更新訂位狀態成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  getReservation,
  postReservation,
  putReservation,
}
