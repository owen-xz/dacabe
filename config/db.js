const mongoose = require('mongoose')
require('dotenv').config() // 載入環境變數

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'dacabe', // 指定資料庫名稱
    })
    console.log('✅ MongoDB Connected!')
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error)
    process.exit(1) // 失敗時結束應用程式
  }
}

module.exports = connectDB
