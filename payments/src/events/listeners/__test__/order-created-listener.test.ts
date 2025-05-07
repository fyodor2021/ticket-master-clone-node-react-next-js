import {
  OrderCreatedEvent,
  OrderStatus,
} from '@ticketing.dev.causeleea/common';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const data: OrderCreatedEvent['data'] = {
    id: orderId,
    version: 0,
    expiresAt: 'asdfasd',
    userId,
    status: OrderStatus.Created,
    ticket: {
      id: 'asdfa',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('replicated the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
