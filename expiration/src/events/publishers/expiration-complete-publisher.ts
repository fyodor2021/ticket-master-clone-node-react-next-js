import { Subjects, Publisher, ExpirationCompleteEvent } from "@ticketing.dev.causeleea/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}