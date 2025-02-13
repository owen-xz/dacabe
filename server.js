const express = require('express')
const connectDB = require('./config/db') // 載入 DB 連線
require('dotenv').config() // 引入 dotenv

const app = express()
const PORT = process.env.PORT || 3001

// 連接 MongoDB
connectDB()

// 設定靜態檔案目錄 (如有前端檔案)
app.use(express.static('public'))

// 解析 JSON 和 URL 編碼請求
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 引入路由
const indexRoutes = require('./routes/index')

// 使用路由
app.use('/', indexRoutes)

// 只在開發環境中啟動伺服器
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`)
  })
}

// 在 Vercel 部署時會自動處理入口點，無需使用 app.listen()
module.exports = app
