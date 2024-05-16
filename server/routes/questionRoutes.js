const express = require('express');
const questionController = require('../controllers/questionController');
const router = express.Router();

router.post('/createquestion', questionController.createQuestions);
router.get('/getallquestions', questionController.getAllQuestions);

module.exports = router;