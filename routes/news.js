const express = require('express')
const { getNews, postNews } = require('../controller/newsController')
const router = express.Router()

// 取得所有新聞
router.get('/news', getNews)

// 新增新聞
router.post('/news', postNews)

module.exports = router
