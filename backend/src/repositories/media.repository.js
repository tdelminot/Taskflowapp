const BaseRepository = require('./base.repository');
const { Media } = require('../models');

class MediaRepository extends BaseRepository {
    constructor() {
        super(Media);
    }
    
    // Find media by user
    async findByUser(userId) {
        return await this.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });
    }
    
    // Find media by task
    async findByTask(taskId) {
        return await this.findAll({
            where: { task_id: taskId },
            order: [['createdAt', 'DESC']]
        });
    }
    
    // Find images only
    async findImages(userId) {
        return await this.findAll({
            where: { user_id: userId, type: 'image' }
        });
    }
    
    // Delete all media for a task
    async deleteByTask(taskId) {
        const media = await this.findByTask(taskId);
        for (const item of media) {
            await this.delete(item.id);
        }
        return media.length;
    }
}

module.exports = new MediaRepository();