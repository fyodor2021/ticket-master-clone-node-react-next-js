import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
it('fetched the order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();
  // make a request to build an order with this ticket
  const { body: orderBody } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: storedOrderBody } = await request(app)
    .get(`/api/orders/${orderBody.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(orderBody.id).toEqual(storedOrderBody.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const userOne = global.signin();
  const userTwo = global.signin();
  // make a request to build an order with this ticket
  const { body: orderBody } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${orderBody.id}`)
    .set('Cookie', userTwo)
    .send({ ticketId: ticket.id })
    .expect(401);
});
