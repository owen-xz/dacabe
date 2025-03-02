const Paint = require('../models/Paint')

// 取得畫作
const getPaints = async (req, res) => {
  try {
    // 判斷必填
    const { offset } = req.query
    if (!offset) {
      return res.status(400).json({ message: 'miss required' })
    }

    // 取得畫作
    const paints = await Paint.find().limit(6).skip(offset)
    return res.status(200).json(paints)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 新增畫作
const postPaint = async (req, res) => {
  // 判斷必填
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ message: 'miss required' })
  }

  // 新增畫作
  try {
    const newPaint = new Paint({
      url: req.body.url,
    })
    await newPaint.save()
    return res.status(200).json({ message: '新增畫作成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 刪除所有畫作
const deletePaints = async (req, res) => {
  try {
    await Paint.deleteMany()
    return res.status(200).json({ message: '刪除所有畫作成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  getPaints,
  postPaint,
  deletePaints,
}
