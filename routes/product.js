const express = require('express')
const {
  getCategory,
  getProducts,
  postProduct,
  deleteProducts,
} = require('../controller/productController')
const router = express.Router()

// 取得分類
router.get('/category', getCategory)

// 取得所有商品
router.get('/products', getProducts)

// 新增商品
router.post('/product', postProduct)

// 刪除所有商品
router.delete('/products', deleteProducts)

module.exports = router
