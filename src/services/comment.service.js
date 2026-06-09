const commentRepository = require('../repositories/comment.repository');
const taskRepository = require('../repositories/task.repository');
const projectRepository = require('../repositories/project.repository');
const { v4: uuidv4 } = require('uuid');

class CommentService {
    // Add comment to task
    async addComment(taskId, userId, content) {
        // Verify access through project
        const task = await taskRepository.findById(taskId);
        if (!task) throw new Error('Task not found');
        
        const project = await projectRepository.findById(task.project_id);
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        const comment = await commentRepository.create({
            id: uuidv4(),
            task_id: taskId,
            user_id: userId,
            content
        });
        
        return await commentRepository.findById(comment.id, {
            include: ['author']
        });
    }

    // Get comments for a task
    async getTaskComments(taskId, userId) {
        const task = await taskRepository.findById(taskId);
        if (!task) throw new Error('Task not found');
        
        const project = await projectRepository.findById(task.project_id);
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        return await commentRepository.findByTask(taskId);
    }

    // Delete comment
    async deleteComment(commentId, userId) {
        const comment = await commentRepository.findById(commentId);
        if (!comment) throw new Error('Comment not found');
        
        const task = await taskRepository.findById(comment.task_id);
        const project = await projectRepository.findById(task.project_id);
        
        if (!project || project.owner_id !== userId) {
            throw new Error('Access denied');
        }
        
        return await commentRepository.delete(commentId);
    }
}

module.exports = new CommentService();