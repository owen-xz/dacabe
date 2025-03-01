const Products = require('../models/Products')

// 取得商品
const getProducts = async (req, res) => {
  try {
    // 判斷必填
    const { offset, category } = req.query
    if (!offset) {
      res.status(400).json({ message: 'miss required' })
    }

    // 取得商品
    let search = {}
    if (category) {
      search = { category }
    }
    const products = await Products.find(search).limit(12).skip(offset)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 新增商品
const postProduct = async (req, res) => {
  // 判斷必填
  const { title, content, photos, price, category } = req.body
  if (!title || !content || !photos || !price || !category) {
    res.status(400).json({ message: 'miss required' })
  }

  // 判斷價格
  if (price < 0) {
    res.status(400).json({ message: '價格不得小於 0' })
  }
  console.log(2)

  // 新增商品
  try {
    const newProduct = new Products({
      title,
      content,
      photos,
      price,
      category,
    })
    await newProduct.save()
    res.status(200).json({ message: '新增商品成功' })
  } catch (error) {
    res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 刪除所有商品
const deleteProducts = async (req, res) => {
  try {
    await Products.deleteMany()
    res.status(200).json({ message: '刪除所有商品成功' })
  } catch (error) {
    res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  getProducts,
  postProduct,
  deleteProducts,
}
