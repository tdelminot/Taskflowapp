const BaseRepository = require('./base.repository');
const { Project, Task, User } = require('../models');

class ProjectRepository extends BaseRepository {
    constructor() {
        super(Project);
    }

    // Find projects by owner
    async findByOwner(ownerId, options = {}) {
        return await this.findAll({
            where: { owner_id: ownerId },
            ...options
        });
    }

    // Find project with its tasks
    async findProjectWithTasks(projectId) {
        return await this.findById(projectId, {
            include: [
                {
                    association: 'tasks',
                    as: 'tasks',
                    include: [
                        {
                            association: 'assignee',
                            as: 'assignee',
                            attributes: ['id', 'username', 'email']
                        }
                    ]
                },
                {
                    association: 'owner',
                    as: 'owner',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
    }

    // Update project progress based on tasks completion
    async updateProgress(projectId) {
        const project = await this.findById(projectId, {
            include: [{ association: 'tasks', as: 'tasks' }]
        });
        
        if (project && project.tasks && project.tasks.length > 0) {
            const doneTasks = project.tasks.filter(t => t.status === 'done').length;
            const progress = Math.round((doneTasks / project.tasks.length) * 100);
            return await this.update(projectId, { progress });
        }
        return project;
    }

    // Get project statistics
    async getProjectStats(projectId) {
        const project = await this.findProjectWithTasks(projectId);
        if (!project) return null;
        
        const tasks = project.tasks || [];
        return {
            totalTasks: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            review: tasks.filter(t => t.status === 'review').length,
            done: tasks.filter(t => t.status === 'done').length
        };
    }
}

module.exports = new ProjectRepository();