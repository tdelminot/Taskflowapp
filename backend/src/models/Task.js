const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                len: [3, 200]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('todo', 'in_progress', 'review', 'done'),
            defaultValue: 'todo'
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            defaultValue: 'medium'
        },
        project_id: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'project_id'
        },
        assigned_to: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'assigned_to'
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'created_by'
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'due_date'
        },
        estimated_hours: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            field: 'estimated_hours'
        },
        actual_hours: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            field: 'actual_hours'
        }
    }, {
        tableName: 'tasks',
        timestamps: true,
        underscored: true
    });


 Task.associate = (models) => {
        Task.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id' });
        Task.hasMany(models.Comment, { as: 'comments', foreignKey: 'task_id' });
        Task.belongsTo(models.User, { as: 'assignee', foreignKey: 'assigned_to' });
        Task.belongsTo(models.User, { as: 'creator', foreignKey: 'created_by' });
    };




    return Task;
};