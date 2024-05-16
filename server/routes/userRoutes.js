const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.post('/forgotpassword', authController.forgotpassword);
router.get('/getallusers', authController.getAllUsers);
router.get('/findone', authController.getOneUser);
router.get('/getprogresstracking/:id' , authController.getProgressTracking);

module.exports = router;