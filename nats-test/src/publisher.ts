import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { Subjects } from '@ticketing.dev.causeleea/common';
const client = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});
client.on('connect', async () => {
  const publisher = new TicketCreatedPublisher(client);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
      userId:'alksdjflkj',
    });
  } catch (err) {
    console.error(err);
  }
});
