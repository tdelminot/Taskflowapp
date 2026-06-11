const projectService = require('../services/project.service');

class ProjectController {
    async create(req, res, next) {
        try {
            const project = await projectService.createProject(req.userId, req.body);
            res.status(201).json(project);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const projects = await projectService.getUserProjects(req.userId, parseInt(page), parseInt(limit));
            res.json(projects);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const project = await projectService.getProjectById(id, req.userId);
            res.json(project);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const project = await projectService.updateProject(id, req.userId, req.body);
            res.json(project);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await projectService.deleteProject(id, req.userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await projectService.getProjectStats(id, req.userId);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProjectController();