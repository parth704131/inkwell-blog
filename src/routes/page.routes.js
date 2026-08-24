const express = require('express');
const pageController = require('../controllers/page.controller');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.get('/', asyncHandler(pageController.home));
router.get('/stories', asyncHandler(pageController.stories));
router.get('/stories/:slug', asyncHandler(pageController.story));
router.get('/about', asyncHandler(pageController.about));

module.exports = router;
