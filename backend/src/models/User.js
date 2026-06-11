const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 50]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'password_hash'
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'banned'),
            defaultValue: 'active'
        },
        avatar_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'avatar_url'
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_login'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true
    });




 User.associate = (models) => {
        User.hasMany(models.Project, { as: 'projects', foreignKey: 'owner_id' });
        User.hasMany(models.Task, { as: 'assigned_tasks', foreignKey: 'assigned_to' });
        User.hasMany(models.Task, { as: 'created_tasks', foreignKey: 'created_by' });
        User.hasMany(models.Comment, { as: 'comments', foreignKey: 'user_id' });
    };







    // Hash password before saving
    User.beforeCreate(async (user) => {
        if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
    });

    User.beforeUpdate(async (user) => {
        if (user.changed('password_hash')) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
    });

    // Instance method to check password
    User.prototype.checkPassword = async function(password) {
        return bcrypt.compare(password, this.password_hash);
    };

    return User;
};