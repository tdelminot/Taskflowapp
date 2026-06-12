const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Single image upload (profile picture, task image)
router.post('/upload/image', upload.single('image'), uploadController.uploadImage);

// Multiple images upload
router.post('/upload/images', upload.array('images', 5), uploadController.uploadMultipleImages);

// Generic file upload (attachments)
router.post('/upload/attachment', upload.single('file'), uploadController.uploadAttachment);

// Upload image for specific task
router.post('/upload/task/:taskId/image', upload.single('image'), uploadController.uploadTaskImage);

module.exports = router;