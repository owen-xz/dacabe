const News = require('../models/News')

// 取得所有新聞
const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 })
    res.status(200).json(news)
  } catch (error) {
    res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 取得單則新聞
const getOneNews = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      res.status(400).json({ message: 'miss required' })
    }
    const news = await News.findById(id)
    res.status(200).json(news)
  } catch (error) {
    res.status(500).json({ message: '發生未知錯誤', error })
  }
}

// 新增新聞
const postNews = async (req, res) => {
  const { title, content, photos } = req.body
  if (!title || !content || !photos) {
    res.status(400).json({ message: 'miss required' })
  }
  try {
    const newNews = new News({
      title,
      content,
      photos,
      createdAt: new Date().toISOString(),
    })
    await newNews.save()
    res.status(200).json({ message: '新增新聞成功' })
  } catch (error) {
    res.status(500).json({ message: '發生未知錯誤', error })
  }
}

module.exports = {
  getNews,
  getOneNews,
  postNews,
}
