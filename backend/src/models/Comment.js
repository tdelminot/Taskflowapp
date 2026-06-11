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

    return Comment;
};