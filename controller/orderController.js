const Orders = require('../models/Orders')
const User = require('../models/User')
const Products = require('../models/Products')

// 取得用戶的所有訂單
const getOrders = async (req, res) => {
  try {
    const userId = req.userId
    const { email } = await User.findById(userId)
    const orders = await Orders.find({ 'orderer.email': email })
      .populate({
        path: 'cart.productId',
        select: 'title price',
      })
      .select('_id cart reservedTime status')
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      cart: order.cart.map((item) => ({
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        count: item.count,
      })),
    }))
    return res.status(200).json(formattedOrders)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 取得單則訂單
const getOrder = async (req, res) => {
  try {
    // 判斷必填
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'miss required' })
    }

    // 取得訂單
    const order = await Orders.findById(id).populate({
      path: 'cart.productId',
      select: 'title price',
    })
    if (!order) {
      return res.status(400).json({ message: '查無此訂單' })
    }

    // 格式化 cart 內的資料
    const formattedOrder = {
      ...order.toObject(),
      cart: order.cart.map((item) => ({
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        count: item.count,
      })),
    }
    return res.status(200).json(formattedOrder)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 新增商品
const postOrder = async (req, res) => {
  try {
    // 判斷必填
    const { cart, orderer, note, reservedTime } = req.body
    if (!cart || !orderer || !reservedTime) {
      return res.status(400).json({ message: 'miss required' })
    }

    // 判斷購物車內容是否正確
    cart.forEach(async (item) => {
      const { productId, count } = item
      if (!productId || !count) {
        return res.status(400).json({ message: 'miss required' })
      }
      if (count < 1) {
        return res.status(400).json({ message: '商品數量不可 <1' })
      }
      const product = await Products.findById(productId).exec()
      if (!product) {
        return res.status(400).json({ message: '查無此商品' })
      }
    })

    // 判斷訂購人內容是否正確
    const { name, phone, email } = orderer
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'miss required' })
    }

    // 判斷預訂時間是否正確
    if (new Date(reservedTime) < new Date()) {
      return res.status(400).json({ message: '不可預訂過去時間' })
    }

    // 新增訂單
    const newCart = cart.map((item) => {
      const { productId, count } = item
      return {
        productId,
        count,
      }
    })
    const newOrder = new Orders({
      cart: newCart,
      orderer: {
        name,
        phone,
        email,
      },
      note: note || '',
      reservedTime,
    })
    await newOrder.save()
    return res.status(200).json(newOrder._id)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  getOrders,
  getOrder,
  postOrder,
}
