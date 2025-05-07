import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing.dev.causeleea/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated

}
