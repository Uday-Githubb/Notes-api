const request = require('supertest');
const app = require('../src/app');

async function authToken(email = 'user@a.com') {
  await request(app).post('/api/auth/signup').send({ email, password: 'password' });
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password' });
  return res.body.data.token;
}

describe('Notes', () => {
  it('requires auth', async () => {
    await request(app).get('/api/notes').expect(401);
  });

  it('creates and fetches notes with pagination', async () => {
    const token = await authToken();
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `t${i}`, content: `c${i}` })
        .expect(201);
    }

    const res1 = await request(app)
      .get('/api/notes?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res1.body.data).toHaveLength(2);
    expect(res1.body.pagination.total).toBe(5);

    const res3 = await request(app)
      .get('/api/notes?page=3&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res3.body.data.length).toBeGreaterThan(0);
    expect(res3.body.pagination.hasPrev).toBe(true);
  });

  it('isolates user data', async () => {
    const tokenA = await authToken('a@a.com');
    const tokenB = await authToken('b@b.com');

    const created = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'ta', content: 'ca' })
      .expect(201);

    const id = created.body.data._id;

    // User B should not see A's notes
    const listB = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);
    expect(listB.body.data).toHaveLength(0);

    // User B cannot fetch A's note
    await request(app)
      .get(`/api/notes/${id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);
  });

  it('updates and deletes a note', async () => {
    const token = await authToken('c@c.com');
    const created = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 't', content: 'c' })
      .expect(201);

    const id = created.body.data._id;

    const updated = await request(app)
      .put(`/api/notes/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 't2' })
      .expect(200);
    expect(updated.body.data.title).toBe('t2');

    await request(app)
      .delete(`/api/notes/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app)
      .get(`/api/notes/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
