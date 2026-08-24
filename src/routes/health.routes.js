const express = require('express');
const healthController = require('../controllers/health.controller');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.get('/health', asyncHandler(healthController.ready));
router.get('/health/live', healthController.live);
router.get('/health/ready', asyncHandler(healthController.ready));

module.exports = router;
