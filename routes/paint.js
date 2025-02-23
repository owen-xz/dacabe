const express = require('express')
const {
  getPaints,
  postPaint,
  deletePaints,
} = require('../controller/paintController')
const router = express.Router()

// 定義首頁路由
router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!')
})

// 取得所有畫作
router.get('/paints', getPaints)

// 新增畫作
router.post('/paint', postPaint)

// 刪除所有畫作
router.delete('/paints', deletePaints)

module.exports = router
