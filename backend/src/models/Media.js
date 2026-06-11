const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Media = sequelize.define('Media', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        original_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'original_name'
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'mime_type'
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id'
        },
        type: {
            type: DataTypes.ENUM('image', 'video', 'document', 'attachment'),
            defaultValue: 'attachment'
        },
        task_id: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'task_id'
        }
    }, {
        tableName: 'media',
        timestamps: true,
        underscored: true
    });
    
    return Media;
};