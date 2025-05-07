import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@ticketing.dev.causeleea/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCancelledEvent['data'], msg: Message){
      const ticket = await Ticket.findById(parsedData.ticket.id);
      
      if(!ticket){
        throw new NotFoundError();
      }
      ticket.set({orderId: undefined})

      await ticket.save();

      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        orderId: ticket.orderId,
        userId: ticket.userId,
        price: ticket.price,
        title: ticket.title,
        version: ticket.version,
      })
      msg.ack();
  }

}