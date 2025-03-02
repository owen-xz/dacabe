const Products = require('../models/Products')
const { categoryEnum } = require('../enums/productEnum')

// 取得分類
const getCategory = async (req, res) => {
  try {
    return res.status(200).json(categoryEnum)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 取得所有商品
const getProducts = async (req, res) => {
  try {
    // 判斷必填
    const { offset, category } = req.query
    if (!offset) {
      return res.status(400).json({ message: 'miss required' })
    }

    // 取得商品
    let search = {}
    if (category) {
      search = { category }
    }
    const products = await Products.find(search).limit(12).skip(offset)
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 取得單則商品
const getProduct = async (req, res) => {
  try {
    // 判斷必填
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'miss required' })
    }

    // 取得商品
    const product = await Products.findById(id)
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 新增商品
const postProduct = async (req, res) => {
  // 判斷必填
  const { title, content, photos, price, category } = req.body
  if (!title || !content || !photos || !price || !category) {
    return res.status(400).json({ message: 'miss required' })
  }

  // 判斷價格
  if (price < 0) {
    return res.status(400).json({ message: '價格不得小於 0' })
  }

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
    return res.status(200).json({ message: '新增商品成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 刪除所有商品
const deleteProducts = async (req, res) => {
  try {
    await Products.deleteMany()
    return res.status(200).json({ message: '刪除所有商品成功' })
  } catch (error) {
    return res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  getCategory,
  getProducts,
  getProduct,
  postProduct,
  deleteProducts,
}
