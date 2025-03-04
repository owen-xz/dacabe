const User = require('../models/User')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
  try {
    // 判斷必填
    const { name, email, password, phone } = req.body
    if (!email || !password || !name || !phone)
      return res.status(400).json({ message: 'Miss required.' })

    // 確認 Email 是否被註冊過
    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) {
      return res.status(400).json({ message: 'Email 已被註冊' })
    }

    // 新增用戶
    const newUser = new User({
      name,
      email,
      password,
      phone,
    })
    await newUser.save()
    return res.status(200).json({ message: '註冊成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

const login = async (req, res) => {
  try {
    // 判斷必填
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Miss required.' })

    // 判斷帳號密碼是否正確
    const user = await User.findOne({ email }).exec()
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: '帳號或密碼錯誤' })
    }

    // 生成 Access Token
    const { _id, name, phone, role } = user
    const accessToken = jwt.sign(
      { userId: _id, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    // 生成 Refresh Token
    const refreshToken = jwt.sign(
      { userId: _id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    // 將 Refresh Token 儲存到 HTTP-only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    })

    return res
      .status(200)
      .json({ accessToken, userId: _id, name, phone, email, role })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' })
    }

    // 驗證 Refresh Token
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    // 檢查用戶是否存在
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' })
    }

    // 生成新的 Access Token
    const { _id, role, name, phone, email } = user
    const accessToken = jwt.sign(
      { userId: _id, userRole: role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    return res
      .status(200)
      .json({ accessToken, userId: _id, name, phone, email, role })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

const logout = (req, res) => {
  try {
    // 清除 HTTP-only Cookie 中的 Refresh Token
    res.clearCookie('refreshToken', {
      httpOnly: true,
    })

    return res.status(200).json({ message: '登出成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 取得用戶資料
const getUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select('name phone email role')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  getUser,
}
