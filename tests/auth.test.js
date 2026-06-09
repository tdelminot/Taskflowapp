const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Auth Endpoints', () => {
    // Données uniques pour ce test
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };

    afterAll(async () => {
        // Fermer la connexion après les tests
        await sequelize.close();
    });

    test('POST /api/auth/register should create a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('username', testUser.username);
        
        // Sauvegarder le token pour le test de login si nécessaire
        testUser.token = response.body.token;
    });

    test('POST /api/auth/login should authenticate user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});