import { ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subjects } from "@ticketing.dev.causeleea/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(parsedData: ExpirationCompleteEvent['data'], msg: Message) {

      const order = await Order.findById(parsedData.orderId).populate('ticket')

      if(!order){
        throw new NotFoundError();
      }
      if(order.status=== OrderStatus.Complete){
        return msg.ack();
      }

      order.set({
        status: OrderStatus.Cancelled,
      });

      await order.save();

      new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price
        }
      });

      msg.ack();

  } 
}