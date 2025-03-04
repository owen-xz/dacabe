const express = require('express')
const connectDB = require('./config/db') // 載入 DB 連線
require('dotenv').config() // 引入 dotenv
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// 連接 MongoDB
connectDB()

// 設定 cors
const allowedOrigins = ['http://localhost:3000', 'https://dacafe.vercel.app']
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true, // ✅ 允許前端攜帶 Cookie
  })
)

// 設定靜態檔案目錄 (如有前端檔案)
app.use(express.static('public'))

// 解析 JSON 和 URL 編碼請求
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 引入路由
const userRoutes = require('./routes/user')
const reservationRoutes = require('./routes/reservation')
const paintRoutes = require('./routes/paint')
const newsRoutes = require('./routes/news')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

// 使用路由
app.use('/api', userRoutes)
app.use('/api', reservationRoutes)
app.use('/api', paintRoutes)
app.use('/api', newsRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`)
})

module.exports = app
