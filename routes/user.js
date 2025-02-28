const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  refresh,
  logout,
} = require('../controller/userController')
const { authMiddleware, isAdmin } = require('../middleware/auth')

// 註冊
router.post('/signup', signup)

// 登入
router.post('/login', login)

// refresh
router.post('/refresh', refresh)

// dengchu
router.post('/logout', logout)

// 普通用戶可以存取的資源
router.get('/user', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a user route',
    userId: req.userId,
    role: req.userRole,
  })
})

// 只有管理者可以存取的資源
router.get('/admin', authMiddleware, isAdmin, (req, res) => {
  res.json({
    message: 'This is an admin route',
    userId: req.userId,
    role: req.userRole,
  })
})

module.exports = router
