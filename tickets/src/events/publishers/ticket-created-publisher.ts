import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing.dev.causeleea/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
