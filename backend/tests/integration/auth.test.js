const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('POST /api/auth/register - should create new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'john_doe',
                email: 'john@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('username', 'john_doe');
        expect(response.body.user).toHaveProperty('email', 'john@example.com');
        expect(response.body.user).not.toHaveProperty('password_hash');
    });

    test('POST /api/auth/register - should not create duplicate user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'john_doe',
                email: 'john@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(500);
    });

    test('POST /api/auth/register - should validate input', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'jo',
                email: 'invalid-email',
                password: '123'
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    test('POST /api/auth/login - should authenticate user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('username', 'john_doe');
    });

    test('POST /api/auth/login - should reject wrong password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'wrongpassword'
            });
        
        expect(response.status).toBe(500);
    });

    test('POST /api/auth/login - should reject non-existent user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(500);
    });
});