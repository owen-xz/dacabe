const express = require('express')
const {
  getOrders,
  getOrder,
  postOrder,
} = require('../controller/orderController')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// 取得用戶的所有訂單
router.get('/orders', authMiddleware, getOrders)

// 取得單則訂單
router.get('/order/:id', getOrder)

// 新增訂單
router.post('/order', postOrder)

module.exports = router
