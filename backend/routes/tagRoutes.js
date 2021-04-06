const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagControllers');

router.get('/', TagController.getTags);
router.get('/campgrounds', TagController.getCampgrounds);

module.exports = router;
