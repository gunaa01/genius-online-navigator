import request from 'supertest';
import server from '../server';

describe('Content Generation API', () => {
  it('should return generated content for a user', async () => {
    const token = 'valid-jwt';
    const res = await request(server.server)
      .get('/api/content')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create new generated content', async () => {
    const token = 'valid-jwt';
    const res = await request(server.server)
      .post('/api/content')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', body: 'Test body', status: 'draft' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
