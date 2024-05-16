const uploadFileMiddleware = require("../middleware/filemiddleware");
const fileUploadController = require('../controllers/fileUploadController');
const express = require('express');
const router = express.Router();

router.post('/upload-files' , uploadFileMiddleware, fileUploadController.uploadSingleFile);
router.get('/get-files' , uploadFileMiddleware, fileUploadController.getFiles);

module.exports = router;