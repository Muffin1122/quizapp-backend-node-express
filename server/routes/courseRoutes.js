const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();

router.post('/createcourse', courseController.createCourse);
router.get('/getcourse/:id', courseController.getCourse);

module.exports = router;

