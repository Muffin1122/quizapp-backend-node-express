const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/getallusers', userController.getAllUsers);
router.get('/findone', userController.getOneUser);
router.get('/getprogresstracking/:id' , userController.getProgressTracking);

module.exports = router;