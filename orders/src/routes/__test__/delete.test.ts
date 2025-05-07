import request from 'supertest'
import {app} from '../../app'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@ticketing.dev.causeleea/common'
import { Order } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'
it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20
  })
  await ticket.save()
  const user = global.signin()
  const {body: orderBody} = await request(app)
  .post('/api/orders')
  .set('Cookie',user )
  .send({ticketId: ticket.id})
  .expect(201)

  const res = await request(app)
  .delete(`/api/orders/${orderBody.id}`)
  .set('Cookie', user)
  .expect(204)

  const storedOrder = await Order.findById(orderBody.id)
  
  expect(storedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('emits an order cancelled event',async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),

  })
  await ticket.save()
  const user = global.signin()
  const {body: orderBody} = await request(app)
  .post('/api/orders')
  .set('Cookie',user )
  .send({ticketId: ticket.id})
  .expect(201)

  const res = await request(app)
  .delete(`/api/orders/${orderBody.id}`)
  .set('Cookie', user)
  .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})