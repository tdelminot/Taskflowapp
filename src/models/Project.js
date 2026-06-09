const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [3, 100]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('planning', 'active', 'completed', 'archived'),
            defaultValue: 'planning'
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'owner_id'
        },
        progress: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100
            }
        }
    }, {
        tableName: 'projects',
        timestamps: true,
        underscored: true
    });

    return Project;
};