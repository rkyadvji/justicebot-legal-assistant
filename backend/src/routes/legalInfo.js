const express = require('express');
const router = express.Router();
const knowledgeBase = require('../data/knowledgeBase.json');

// GET /api/legal-info - Returns all legal info articles
router.get('/', (req, res) => {
  const { category, language = 'en' } = req.query;

  let articles = knowledgeBase.legalInfo;

  if (category) {
    articles = articles.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
  }

  const localizedArticles = articles.map(a => ({
    ...a,
    displayTitle: language === 'hi' && a.titleHi ? a.titleHi : a.title
  }));

  res.json({ success: true, count: localizedArticles.length, articles: localizedArticles });
});

// GET /api/legal-info/:id
router.get('/:id', (req, res) => {
  const { language = 'en' } = req.query;
  const article = knowledgeBase.legalInfo.find(a => a.id === req.params.id);

  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  res.json({
    success: true,
    article: {
      ...article,
      displayTitle: language === 'hi' && article.titleHi ? article.titleHi : article.title
    }
  });
});

// GET /api/legal-info/faqs/all
router.get('/faqs/all', (req, res) => {
  const { language = 'en' } = req.query;
  const faqs = knowledgeBase.faqs.map(f => ({
    question: language === 'hi' && f.questionHi ? f.questionHi : f.question,
    answer: language === 'hi' && f.answerHi ? f.answerHi : f.answer
  }));
  res.json({ success: true, faqs });
});

module.exports = router;
