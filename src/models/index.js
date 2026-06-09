const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Import models
const User = require('./User')(sequelize);
const Project = require('./Project')(sequelize);
const Task = require('./Task')(sequelize);
const Comment = require('./Comment')(sequelize);

// Define associations
User.hasMany(Project, { foreignKey: 'owner_id', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assigned_tasks' });
User.hasMany(Task, { foreignKey: 'created_by', as: 'created_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Task.hasMany(Comment, { foreignKey: 'task_id', as: 'comments' });
Comment.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = {
    sequelize,
    User,
    Project,
    Task,
    Comment
};