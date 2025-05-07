import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper as natsClient } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provide id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(404);
});
it('return a 401 if the user is not authenticated', async() => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async() => {
  const createRes = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(201);


    console.log(createRes.body)
    await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: 40,
    })
    .expect(401);
});


it('returns a 400 if the user provides an invalid title or price', async() => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin()
 const createRes =  await request(app)
    .post(`/api/tickets/`)
    .set('Cookie',cookie )
    .send({
      title: 'asdf',
      price: 40,
    })
    .expect(201);

    await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 40,
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfas',
      price: -10,
    })
    .expect(400);
});
it('updates the ticket provided valid inputs', async() => {
  const cookie = global.signin()
 const createRes =  await request(app)
    .post(`/api/tickets/`)
    .set('Cookie',cookie )
    .send({
      title: 'asdf',
      price: 40,
    })
    .expect(201);
    const title = 'new title'
    const price = 50
    await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);


    const ticketRes = await request(app)
    .get(`/api/tickets/${createRes.body.id}`)
    .send()
    .expect(200);
    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);
});

it('publishes an event', async () => {
  const cookie = global.signin()
  const createRes =  await request(app)
     .post(`/api/tickets/`)
     .set('Cookie',cookie )
     .send({
       title: 'asdf',
       price: 40,
     })
     .expect(201);
     const title = 'new title'
     const price = 50
     await request(app)
     .put(`/api/tickets/${createRes.body.id}`)
     .set('Cookie', cookie)
     .send({
       title,
       price,
     })
     .expect(200);
  expect(natsClient.client.publish).toHaveBeenCalled();
})

it('rejects a ticket if the ticket is reserved', async () => {
  const cookie = global.signin()
  const createRes =  await request(app)
     .post(`/api/tickets/`)
     .set('Cookie',cookie )
     .send({
       title: 'asdf',
       price: 40,
     });
     const ticket = await Ticket.findById(createRes.body.id)
     ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()})
     await ticket!.save();
     const title = 'new title'
     const price = 50
     await request(app)
     .put(`/api/tickets/${createRes.body.id}`)
     .set('Cookie', cookie)
     .send({
       title,
       price,
     })
     .expect(400);

})