import { Listener } from '@ticketing.dev.causeleea/common';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@ticketing.dev.causeleea/common';
import { Subjects } from '@ticketing.dev.causeleea/common';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated =  Subjects.TicketCreated;
  queueGroupName = 'payment-srv';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
