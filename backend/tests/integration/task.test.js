const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

let authToken;
let projectId;

describe('Task Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
        // Create user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'task_user',
                email: 'task@example.com',
                password: 'password123'
            });
        
        authToken = registerRes.body.token;
        
        // Create project
        const projectRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Task Project' });
        
        projectId = projectRes.body.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('POST /api/projects/:projectId/tasks - should create a task', async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                priority: 'high'
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
        expect(response.body.project_id).toBe(projectId);
    });

    test('GET /api/tasks/:id - should get task details', async () => {
        // Create task first
        const createRes = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Detail Task' });
        
        const taskId = createRes.body.id;
        
        const response = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(taskId);
    });

    test('PUT /api/tasks/:id - should update task', async () => {
        const createRes = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'To Update' });
        
        const taskId = createRes.body.id;
        
        const response = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ status: 'in_progress', priority: 'urgent' });
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('in_progress');
        expect(response.body.priority).toBe('urgent');
    });

    test('DELETE /api/tasks/:id - should delete task', async () => {
        const createRes = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'To Delete' });
        
        const taskId = createRes.body.id;
        
        const response = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(204);
    });
});