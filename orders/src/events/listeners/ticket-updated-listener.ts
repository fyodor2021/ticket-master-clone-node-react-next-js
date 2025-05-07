import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from '@ticketing.dev.causeleea/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(parsedData: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(parsedData)
    if (!ticket) {
      throw new NotFoundError();
    }
    const { title, price } = parsedData;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
