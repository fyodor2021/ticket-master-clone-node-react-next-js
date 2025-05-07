import { Subjects, Publisher, PaymentCreatedEvent } from "@ticketing.dev.causeleea/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  
}