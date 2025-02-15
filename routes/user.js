const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// 註冊
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body
  if (!email || !password || !name || !phone)
    return res.status(400).json({ message: 'Miss required.' })

  // 確認 Email 是否被註冊過
  const duplicate = await User.findOne({ email }).exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Email 已被註冊' })
  }

  try {
    // encrpty the password (hash and salt)
    const hashedPassword = await bcrypt.hash(password, 12)

    //create and store the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      permission: '',
    })

    await newUser.save()
    res.status(201).json({
      message: '註冊成功',
      data: newUser,
      status: 'success',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// 登入
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Miss required.' })

    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser) return res.status(401).json({ message: '帳號密碼錯誤' }) // Unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
      // create JWTs
      const { _id, name, email, phone } = foundUser
      const UserInfo = {
        userId: _id,
        name,
        phone,
        email,
      }
      const accessToken = jwt.sign(
        {
          UserInfo,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      )
      const refreshToken = jwt.sign(
        {
          UserInfo,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      )

      // Saving refreshToken with current user
      foundUser.refreshToken = refreshToken
      await foundUser.save()

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        // sameSite: "None",
      })

      // 正式 回傳accessToken
      // 判斷是不是管理者登入
      if (foundUser.permission) {
        res.json({
          accessToken,
          userId: _id,
          name,
          phone,
          email,
          permission: foundUser.permission,
        })
        return
      }
      res.json({ accessToken, userId: _id, name, phone, email })
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
