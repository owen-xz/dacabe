const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '登入過期或驗證失敗！' })
  }
  try {
    const { userId, role } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'userId 不存在' })
    }
    req.userId = userId
    req.userRole = role
    next()
  } catch (error) {
    return res.status(401).json({ error: '登入過期或驗證失敗！' })
  }
}

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: '權限不足' })
  }
  next()
}

module.exports = { authMiddleware, isAdmin }
