const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagControllers');

router.get('/', TagController.getTags);

module.exports = router;
