const BaseRepository = require('./base.repository');
const { User } = require('../models');
const { Op } = require('sequelize');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    // Find user by email
    async findByEmail(email) {
        return await this.findOne({ email });
    }

    // Find user by username
    async findByUsername(username) {
        return await this.findOne({ username });
    }

    // Find user with their projects
    async findUserWithProjects(userId) {
        return await this.findById(userId, {
            include: [
                {
                    association: 'projects',
                    as: 'projects'
                }
            ]
        });
    }

    // Find user with assigned tasks
    async findUserWithTasks(userId) {
        return await this.findById(userId, {
            include: [
                {
                    association: 'assigned_tasks',
                    as: 'assigned_tasks'
                }
            ]
        });
    }

    // Update last login date
    async updateLastLogin(userId) {
        return await this.update(userId, { last_login: new Date() });
    }

    // Get all active users
    async getActiveUsers() {
        return await this.findAll({
            where: { status: 'active' }
        });
    }
}

module.exports = new UserRepository();