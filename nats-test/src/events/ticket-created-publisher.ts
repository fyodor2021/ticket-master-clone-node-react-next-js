import { Publisher } from "@ticketing.dev.causeleea/common";
import { TicketCreatedEvent } from "@ticketing.dev.causeleea/common";
import { Subjects } from "@ticketing.dev.causeleea/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  
}