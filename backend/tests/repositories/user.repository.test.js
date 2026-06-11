const { sequelize } = require('../../src/models');
const userRepository = require('../../src/repositories/user.repository');
const { v4: uuidv4 } = require('uuid');

describe('UserRepository', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('should create a user', async () => {
        const userData = {
            id: uuidv4(),
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashedpassword'
        };
        
        const user = await userRepository.create(userData);
        
        expect(user).toBeDefined();
        expect(user.username).toBe('testuser');
        expect(user.email).toBe('test@example.com');
    });

    test('should find user by email', async () => {
        const user = await userRepository.findByEmail('test@example.com');
        
        expect(user).toBeDefined();
        expect(user.email).toBe('test@example.com');
    });

    test('should find user by username', async () => {
        const user = await userRepository.findByUsername('testuser');
        
        expect(user).toBeDefined();
        expect(user.username).toBe('testuser');
    });
});