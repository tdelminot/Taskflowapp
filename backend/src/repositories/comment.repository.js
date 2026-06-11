const BaseRepository = require('./base.repository');
const { Comment, User } = require('../models');

class CommentRepository extends BaseRepository {
    constructor() {
        super(Comment);
    }

    // Find comments by task
    async findByTask(taskId, options = {}) {
        return await this.findAll({
            where: { task_id: taskId },
            include: [
                {
                    association: 'author',
                    as: 'author',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ],
            order: [['createdAt', 'ASC']],
            ...options
        });
    }

    // Delete all comments for a task
    async deleteByTask(taskId) {
        return await this.model.destroy({
            where: { task_id: taskId }
        });
    }
}

module.exports = new CommentRepository();