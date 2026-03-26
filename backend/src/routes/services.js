const express = require('express');
const router = express.Router();
const knowledgeBase = require('../data/knowledgeBase.json');

// GET /api/services - Returns all DoJ services
router.get('/', (req, res) => {
  const { category, language = 'en' } = req.query;

  let services = knowledgeBase.services;

  if (category) {
    services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  // Localize based on language
  const localizedServices = services.map(s => ({
    ...s,
    displayName: language === 'hi' && s.nameHi ? s.nameHi : s.name,
    displayDescription: language === 'hi' && s.descriptionHi ? s.descriptionHi : s.description
  }));

  res.json({
    success: true,
    count: localizedServices.length,
    services: localizedServices
  });
});

// GET /api/services/:id - Returns a specific service
router.get('/:id', (req, res) => {
  const { language = 'en' } = req.query;
  const service = knowledgeBase.services.find(s => s.id === req.params.id);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({
    success: true,
    service: {
      ...service,
      displayName: language === 'hi' && service.nameHi ? service.nameHi : service.name,
      displayDescription: language === 'hi' && service.descriptionHi ? service.descriptionHi : service.description
    }
  });
});

module.exports = router;
