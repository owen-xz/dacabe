const express = require('express')
const Paint = require('../models/Paint')
const router = express.Router()

// 定義首頁路由
router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!')
})

// 取得所有畫作
router.get('/paints', async (req, res) => {
  try {
    const paints = await Paint.find()
    res.json(paints)
  } catch (error) {
    res.status(500).json({ message: '無法取得圖片', error })
  }
})

// 新增畫作
router.post('/paint', async (req, res) => {
  try {
    const newPaint = new Paint({
      url: req.body.url,
    })

    const savedPaint = await newPaint.save()
    res.status(201).json(savedPaint)
  } catch (error) {
    res.status(500).json({ message: '無法新增圖片', error })
  }
})

// 刪除所有畫作
router.delete('/paints', async (req, res) => {
  try {
    const result = await Paint.deleteMany()
    console.log(result)

    res.status(201).json({ message: '刪除成功', result })
  } catch (error) {
    res.status(500).json({ message: '無法刪除圖片', error })
  }
})

module.exports = router
