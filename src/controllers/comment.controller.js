const commentService = require('../services/comment.service');

class CommentController {
    async create(req, res, next) {
        try {
            const { taskId } = req.params;
            const { content } = req.body;
            const comment = await commentService.addComment(taskId, req.userId, content);
            res.status(201).json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getByTask(req, res, next) {
        try {
            const { taskId } = req.params;
            const comments = await commentService.getTaskComments(taskId, req.userId);
            res.json(comments);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await commentService.deleteComment(id, req.userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController();