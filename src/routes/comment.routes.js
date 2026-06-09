const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/tasks/:taskId/comments', commentController.create);
router.get('/tasks/:taskId/comments', commentController.getByTask);
router.delete('/comments/:id', commentController.delete);

module.exports = router;