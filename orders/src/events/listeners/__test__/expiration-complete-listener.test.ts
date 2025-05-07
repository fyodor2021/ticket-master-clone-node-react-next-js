import { ExpirationCompleteEvent, OrderStatus, TicketCreatedEvent, NotFoundError } from "@ticketing.dev.causeleea/common";
import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const userId = new mongoose.Types.ObjectId().toHexString()
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: ticketId
  })
  const order = Order.build({
    userId,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await ticket.save();
  await order.save();
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
// @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener,order,ticket, data, msg}
}

it('updates the order status to cancelled', async () => {
   const {listener, order, msg, data} = await setup()

   await listener.onMessage(data, msg);

   const updatedOrder = await Order.findById(data.orderId)

   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  
})

it('emit an OrderCancelled event', async () => {
  const {listener,order, msg, data} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
})

it('ack the message', async () => {
  const {listener, msg, data} = await setup()

    await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled();

})
