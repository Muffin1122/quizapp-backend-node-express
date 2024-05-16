const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();

router.post('/createquiz', quizController.createQuiz);
router.get('/getquiz/:id', quizController.getQuiz);
router.get('/getallquiz', quizController.getAllQuiz);
router.post('/attemptquiz/:id/submit', quizController.submitQuiz);
router.get('/getleaderdashboard', quizController.getLeaderboard);
router.get('/getanalyticsdashboard' , quizController.getAnalytics);
// router.delete('/deletequiz/:id', quizController.deleteQuiz);
module.exports = router;