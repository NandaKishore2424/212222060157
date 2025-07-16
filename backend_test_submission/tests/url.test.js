const request = require('supertest');
const app = require('../src/app');

describe('URL Shortener API', () => {
  test('health check works', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });

  test('creates short URL', async () => {
    const testUrl = 'https://www.google.com';
    
    const response = await request(app)
      .post('/shorturls')
      .send({ url: testUrl })
      .expect(201);
    
    expect(response.body.shortLink).toBeDefined();
    expect(response.body.expiry).toBeDefined();
  });

  test('rejects invalid URL', async () => {
    const response = await request(app)
      .post('/shorturls')
      .send({ url: 'not-a-valid-url' })
      .expect(400);
    
    expect(response.body.error).toBe('Invalid URL format');
  });
});