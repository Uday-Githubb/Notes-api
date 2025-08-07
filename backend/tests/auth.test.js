const request = require('supertest');
const app = require('../src/app');

describe('Auth', () => {
  it('should signup a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'a@b.com', password: 'password' })
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should login a user', async () => {
    await request(app).post('/api/auth/signup').send({ email: 'a@b.com', password: 'password' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@b.com', password: 'password' })
      .expect(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    await request(app).post('/api/auth/signup').send({ email: 'a@b.com', password: 'password' });
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@b.com', password: 'wrong' })
      .expect(401);
  });
});
