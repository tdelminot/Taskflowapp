const { CacheService } = require('../config/redis.config');

class ProjectCacheService {
    constructor() {
        this.ttl = parseInt(process.env.CACHE_TTL) || 300;
    }

    // Cache keys
    getProjectKey(projectId) {
        return `project:${projectId}`;
    }

    getUserProjectsKey(userId, page = 1, limit = 10) {
        return `user:${userId}:projects:${page}:${limit}`;
    }

    getProjectStatsKey(projectId) {
        return `project:stats:${projectId}`;
    }

    // Cache a project
    async cacheProject(project) {
        if (!project || !project.id) return;
        const key = this.getProjectKey(project.id);
        await CacheService.set(key, project, this.ttl);
    }

    // Get cached project
    async getCachedProject(projectId) {
        return await CacheService.get(this.getProjectKey(projectId));
    }

    // Cache user projects list
    async cacheUserProjects(userId, projects, page = 1, limit = 10) {
        const key = this.getUserProjectsKey(userId, page, limit);
        await CacheService.set(key, projects, this.ttl);
    }

    // Get cached user projects
    async getCachedUserProjects(userId, page = 1, limit = 10) {
        const key = this.getUserProjectsKey(userId, page, limit);
        return await CacheService.get(key);
    }

    // Invalidate all caches for a project
    async invalidateProject(projectId, userId) {
        // Delete specific project
        await CacheService.del(this.getProjectKey(projectId));
        
        // Delete project stats
        await CacheService.del(this.getProjectStatsKey(projectId));
        
        // Delete all user project lists (pattern matching)
        await CacheService.delPattern(`user:${userId}:projects:*`);
        
        console.log(`Cache invalidated for project ${projectId}`);
    }

    // Increment project view count
    async incrementProjectViews(projectId) {
        const key = `project:views:${projectId}`;
        const views = await CacheService.incr(key, 3600); // 1 hour TTL
        return views;
    }
}

module.exports = new ProjectCacheService();