const taskService = require('../services/task.service');

class TaskController {
    async create(req, res, next) {
        try {
            const { projectId } = req.params;
            const task = await taskService.createTask(projectId, req.userId, req.body);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const task = await taskService.getTaskById(id, req.userId);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            // L'ordre : (taskId, userId, updateData)
            const task = await taskService.updateTask(id, req.userId, req.body);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await taskService.deleteTask(id, req.userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();