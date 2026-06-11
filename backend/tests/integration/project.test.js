const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

let authToken;
let userId;

describe('Project Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
        // Create a test user and get token
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'project_owner',
                email: 'owner@example.com',
                password: 'password123'
            });
        
        authToken = registerRes.body.token;
        userId = registerRes.body.user.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('POST /api/projects - should create a project', async () => {
        const response = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'My First Project',
                description: 'This is a test project'
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('My First Project');
        expect(response.body.owner_id).toBe(userId);
    });

    test('POST /api/projects - should reject without auth', async () => {
        const response = await request(app)
            .post('/api/projects')
            .send({
                name: 'No Auth Project'
            });
        
        expect(response.status).toBe(401);
    });

    test('GET /api/projects - should list user projects', async () => {
        const response = await request(app)
            .get('/api/projects')
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/projects/:id - should get project details', async () => {
        // First create a project
        const createRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Detail Project' });
        
        const projectId = createRes.body.id;
        
        const response = await request(app)
            .get(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(projectId);
        expect(response.body).toHaveProperty('stats');
    });

    test('PUT /api/projects/:id - should update project', async () => {
        const createRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'To Update' });
        
        const projectId = createRes.body.id;
        
        const response = await request(app)
            .put(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Updated Name', description: 'New description' });
        
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Name');
    });

    test('DELETE /api/projects/:id - should delete project', async () => {
        const createRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'To Delete' });
        
        const projectId = createRes.body.id;
        
        const response = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(204);
    });
});