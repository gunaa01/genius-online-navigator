import request from 'supertest';
import server from '../server';

describe('SEO API', () => {
  it('should return meta tags for a valid path', async () => {
    const token = 'valid-jwt';
    const res = await request(server.server)
      .get('/api/seo/meta-tags?path=/home')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('keywords');
  });

  it('should return 404 for an invalid path', async () => {
    const token = 'valid-jwt';
    const res = await request(server.server)
      .get('/api/seo/meta-tags?path=/invalid')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
