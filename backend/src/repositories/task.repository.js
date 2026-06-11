const BaseRepository = require('./base.repository');
const { Task, Comment, User } = require('../models');
const { Op } = require('sequelize');

class TaskRepository extends BaseRepository {
    constructor() {
        super(Task);
    }

    // Find tasks by project
    async findByProject(projectId, options = {}) {
        return await this.findAll({
            where: { project_id: projectId },
            ...options
        });
    }

    // Find tasks assigned to user
    async findByAssignee(userId, options = {}) {
        return await this.findAll({
            where: { assigned_to: userId },
            ...options
        });
    }

    // Find task with comments
    async findTaskWithComments(taskId) {
        return await this.findById(taskId, {
            include: [
                {
                    association: 'comments',
                    as: 'comments',
                    include: [
                        {
                            association: 'author',
                            as: 'author',
                            attributes: ['id', 'username', 'avatar_url']
                        }
                    ],
                    order: [['createdAt', 'ASC']]
                },
                {
                    association: 'assignee',
                    as: 'assignee',
                    attributes: ['id', 'username', 'email']
                },
                {
                    association: 'creator',
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                },
                {
                    association: 'project',
                    as: 'project',
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    // Update task status
    async updateStatus(taskId, status) {
        return await this.update(taskId, { status });
    }

    // Get overdue tasks
    async getOverdueTasks() {
        const today = new Date();
        return await this.findAll({
            where: {
                due_date: { [Op.lt]: today },
                status: { [Op.ne]: 'done' }
            }
        });
    }

    // Get tasks due soon (next 3 days)
    async getTasksDueSoon() {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
        
        return await this.findAll({
            where: {
                due_date: {
                    [Op.between]: [today, threeDaysLater]
                },
                status: { [Op.ne]: 'done' }
            },
            order: [['due_date', 'ASC']]
        });
    }
}

module.exports = new TaskRepository();