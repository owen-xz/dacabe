const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { roleEnum } = require('../enums/userEnum')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: roleEnum,
    required: true,
    default: 'user',
  },
})

// 儲存前將密碼加密
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// 比較密碼的方法
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
