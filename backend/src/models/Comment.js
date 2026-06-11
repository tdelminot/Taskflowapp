const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        task_id: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'task_id'
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id'
        }
    }, {
        tableName: 'comments',
        timestamps: true,
        underscored: true
    });




 Comment.associate = (models) => {
        Comment.belongsTo(models.Task, { as: 'task', foreignKey: 'task_id' });
        Comment.belongsTo(models.User, { as: 'author', foreignKey: 'user_id' });
    };






    return Comment;
};