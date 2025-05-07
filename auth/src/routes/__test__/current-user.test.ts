import request from 'supertest';
import {app} from '../../app'

it('responds with details about the current user', async () => {
  const cookie = await signin()
  if(!cookie){
    throw new Error('Cookie not set after signup')
  }

  const res = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie',cookie)
  .send()
  .expect(200)
  expect(res.body.currentUser.email).toEqual('test@test.com')
})

it('reponds with null if not authenticated', async () => {
  const res = await request(app)
  .get('/api/users/currentuser')
  .send()
  .expect(200);
  expect(res.body.currentUser).toEqual(null)

})