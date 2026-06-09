const projectRepository = require('../repositories/project.repository');
const { v4: uuidv4 } = require('uuid');

class ProjectService {
    // Create a new project
    async createProject(ownerId, projectData) {
        const project = await projectRepository.create({
            id: uuidv4(),
            owner_id: ownerId,
            ...projectData
        });
        return project;
    }

    // Get all projects for a user
    async getUserProjects(userId, page = 1, limit = 10) {
        return await projectRepository.paginate({
            page,
            limit,
            condition: { owner_id: userId }
        });
    }

    // Get project by id with details
    async getProjectById(projectId, userId) {
        const project = await projectRepository.findProjectWithTasks(projectId);
        
        // Check if user has access
        if (!project || (project.owner_id !== userId)) {
            throw new Error('Project not found or access denied');
        }
        
        const stats = await projectRepository.getProjectStats(projectId);
        
        return {
            ...project.toJSON(),
            stats
        };
    }

    // Update project
    async updateProject(projectId, userId, updateData) {
        const project = await projectRepository.findById(projectId);
        
        if (!project || project.owner_id !== userId) {
            throw new Error('Project not found or access denied');
        }
        
        return await projectRepository.update(projectId, updateData);
    }

    // Delete project
    async deleteProject(projectId, userId) {
        const project = await projectRepository.findById(projectId);
        
        if (!project || project.owner_id !== userId) {
            throw new Error('Project not found or access denied');
        }
        
        return await projectRepository.softDelete(projectId);
    }

    // Get project statistics
    async getProjectStats(projectId, userId) {
        const project = await projectRepository.findById(projectId);
        
        if (!project || project.owner_id !== userId) {
            throw new Error('Project not found or access denied');
        }
        
        return await projectRepository.getProjectStats(projectId);
    }
}

module.exports = new ProjectService();