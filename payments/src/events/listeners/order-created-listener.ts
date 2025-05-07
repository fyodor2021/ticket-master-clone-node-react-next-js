import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@ticketing.dev.causeleea/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName: string = queueGroupName;

  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      version: parsedData.version,
      userId: parsedData.userId,
      price: parsedData.ticket.price,
      status: parsedData.status,
      id: parsedData.id,
    });

    await order.save();

    msg.ack();
  }
}
