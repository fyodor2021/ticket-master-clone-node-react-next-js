import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@ticketing.dev.causeleea/common";
import {Ticket} from '../../models/ticket'
import { queueGroupName } from "./queue-group-name";
export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(parsedData: TicketCreatedEvent['data'], msg: Message) {
    const {id, title, price} = parsedData;
    const ticket = Ticket.build({
      id,title,price,
    }) 

    await ticket.save();
    
    msg.ack();
  }
}