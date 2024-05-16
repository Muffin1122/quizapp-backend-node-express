const express = require('express');
const discussionController = require('../controllers/discussionController');
const router = express.Router();

router.post('/createdicussion', discussionController.createDiscussion);
router.get('/getdiscussion', discussionController.getAllDiscussions);
module.exports = router;           