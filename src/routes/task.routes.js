const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateTask } = require('../middlewares/validation.middleware');

router.use(authMiddleware);

router.post('/projects/:projectId/tasks', validateTask, taskController.create);
router.get('/tasks/:id', taskController.getOne);
router.put('/tasks/:id', validateTask, taskController.update);
router.delete('/tasks/:id', taskController.delete);

module.exports = router;