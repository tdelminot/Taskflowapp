const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateProject } = require('../middlewares/validation.middleware');

router.use(authMiddleware);

router.post('/', validateProject, projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);
router.get('/:id/stats', projectController.getStats);
router.put('/:id', validateProject, projectController.update);
router.delete('/:id', projectController.delete);

module.exports = router;