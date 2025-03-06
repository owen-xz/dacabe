const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  refresh,
  logout,
  getUser,
  putUser,
} = require('../controller/userController')
const { authMiddleware, isAdmin } = require('../middleware/auth')

// 註冊
router.post('/signup', signup)

// 登入
router.post('/login', login)

// refresh
router.post('/refresh', refresh)

// 登出
router.post('/logout', logout)

// 取得用戶資料
router.get('/user', authMiddleware, getUser)

// 更新用戶資料
router.put('/user', authMiddleware, putUser)

module.exports = router
