import request from 'supertest';
import {app} from '../../app';


it('fails when an email that does not exist is supplied', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'asdfasdf'
  })
  .expect(400);
});

it('returns 200 on successful sigin', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(200);
});

it('returns a header of type Set-Cookie on successful signin', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);
  const res = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(200);
  expect(res.get('Set-Cookie')).toBeDefined();
});