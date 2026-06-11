const projectRepository = require('../repositories/project.repository');
const { v4: uuidv4 } = require('uuid');
const projectCacheService = require('./cache.service');
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
    // Try cache first
    const cached = await projectCacheService.getCachedProject(projectId);
    if (cached && cached.owner_id === userId) {
        console.log('Cache hit for project', projectId);
        return cached;
    }
    
    const project = await projectRepository.findProjectWithTasks(projectId);
    
    if (!project || (project.owner_id !== userId)) {
        throw new Error('Project not found or access denied');
    }
    
    const stats = await projectRepository.getProjectStats(projectId);
    const result = {
        ...project.toJSON(),
        stats
    };
    
    // Cache the result
    await projectCacheService.cacheProject(result);
    
    return result;
}


    // Update project
    async updateProject(projectId, userId, updateData) {
    const project = await projectRepository.findById(projectId);
    
    if (!project || project.owner_id !== userId) {
        throw new Error('Project not found or access denied');
    }
    
    const updated = await projectRepository.update(projectId, updateData);
    
    // Invalidate cache
    await projectCacheService.invalidateProject(projectId, userId);
    
    return updated;
}

    // Delete project
   async deleteProject(projectId, userId) {
    const project = await projectRepository.findById(projectId);
    
    if (!project || project.owner_id !== userId) {
        throw new Error('Project not found or access denied');
    }
    
    const result = await projectRepository.softDelete(projectId);
    
    // Invalidate cache
    await projectCacheService.invalidateProject(projectId, userId);
    
    return result;
}


// Add method to get user projects with cache
async getUserProjectsWithCache(userId, page = 1, limit = 10) {
    // Try cache first
    const cached = await projectCacheService.getCachedUserProjects(userId, page, limit);
    if (cached) {
        console.log('Cache hit for user projects', userId);
        return cached;
    }
    
    const projects = await projectRepository.paginate({
        page,
        limit,
        condition: { owner_id: userId }
    });
    
    // Cache the result
    await projectCacheService.cacheUserProjects(userId, projects, page, limit);
    
    return projects;
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