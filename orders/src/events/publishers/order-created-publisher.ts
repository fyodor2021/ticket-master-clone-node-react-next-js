import { Publisher, OrderCreatedEvent, Subjects } from "@ticketing.dev.causeleea/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}