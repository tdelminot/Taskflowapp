const BaseRepository = require('./base.repository');
const { Task, Comment, User, Project } = require('../models');
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

    // Find task with comments - VERSION CORRIGÉE
    async findTaskWithComments(taskId) {
        return await this.findById(taskId, {
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['id', 'username', 'avatar_url']
                        }
                    ],
                    order: [['createdAt', 'ASC']]
                },
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Project,  // ← Utiliser Project, pas Task !
                    as: 'project',
                    attributes: ['id', 'name', 'owner_id']
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