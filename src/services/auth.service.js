const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

class AuthService {
    // Generate JWT token
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
    }

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    // Register new user
    async register(userData) {
        const { username, email, password } = userData;
        
        // Check if user exists
        const existingUser = await userRepository.findOne({
            [Op.or]: [{ email }, { username }]
        });
        
        if (existingUser) {
            throw new Error('User with this email or username already exists');
        }
        
        // Create user
        const user = await userRepository.create({
            id: uuidv4(),
            username,
            email,
            password_hash: password
        });
        
        // Generate token
        const token = this.generateToken(user.id);
        
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    }

    // Login user
    async login(email, password) {
        // Find user by email
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        // Check password
        const isValid = await user.checkPassword(password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        
        // Check if user is active
        if (user.status !== 'active') {
            throw new Error('Account is disabled');
        }
        
        // Update last login
        await userRepository.updateLastLogin(user.id);
        
        // Generate token
        const token = this.generateToken(user.id);
        
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    }
}

module.exports = new AuthService();