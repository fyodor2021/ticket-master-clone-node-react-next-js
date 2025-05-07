import { Publisher, OrderCancelledEvent, Subjects } from "@ticketing.dev.causeleea/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}