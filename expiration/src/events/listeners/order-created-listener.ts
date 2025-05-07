import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@ticketing.dev.causeleea/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(parsedData.expiresAt).getTime() - new Date().getTime();
    console.log('waiting this many seconds to process a job', delay)
    await expirationQueue.add(
      {
        orderId: parsedData.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
