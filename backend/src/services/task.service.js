const taskRepository = require('../repositories/task.repository');
const projectRepository = require('../repositories/project.repository');
const { v4: uuidv4 } = require('uuid');

class TaskService {
    // Create a new task
    async createTask(projectId, creatorId, taskData) {
        // Verify project exists and user has access
        const project = await projectRepository.findById(projectId);
        if (!project || project.owner_id !== creatorId) {
            throw new Error('Project not found or access denied');
        }
        
        const task = await taskRepository.create({
            id: uuidv4(),
            project_id: projectId,
            created_by: creatorId,
            ...taskData
        });
        
        // Update project progress
        await projectRepository.updateProgress(projectId);
        
        return task;
    }

    // Get task by id with details
    async getTaskById(taskId, userId) {
        const task = await taskRepository.findTaskWithComments(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        // Vérifier l'accès via le projet
        const project = await projectRepository.findById(task.project_id);
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        return task;
    }

    // Update task
    async updateTask(taskId, userId, updateData) {
        const task = await taskRepository.findById(taskId);
        if (!task) throw new Error('Task not found');
        
        const project = await projectRepository.findById(task.project_id);
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        const updated = await taskRepository.update(taskId, updateData);
        
        // Update project progress if status changed
        if (updateData.status !== undefined) {
            await projectRepository.updateProgress(task.project_id);
        }
        
        return updated;
    }

    // Delete task
    async deleteTask(taskId, userId) {
        const task = await taskRepository.findById(taskId);
        if (!task) throw new Error('Task not found');
        
        const project = await projectRepository.findById(task.project_id);
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        const result = await taskRepository.delete(taskId);
        
        // Update project progress
        await projectRepository.updateProgress(task.project_id);
        
        return result;
    }

    // Get tasks by status
    async getTasksByStatus(projectId, userId, status) {
        const project = await projectRepository.findById(projectId);
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        return await taskRepository.findAll({
            where: { project_id: projectId, status }
        });
    }
}

module.exports = new TaskService();