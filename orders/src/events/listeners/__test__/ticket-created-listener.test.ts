import { TicketCreatedEvent } from "@ticketing.dev.causeleea/common";
import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 19,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  }
// @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {listener, data, msg}
}

it('creates and saves a ticket', async () => {
   const {listener, data, msg} = await setup()

   await listener.onMessage(data, msg);

   const ticket = await Ticket.findById(data.id)

   expect(ticket).toBeDefined();
   expect(ticket!.title).toEqual(data.title);
   expect(ticket!.price).toEqual(data.price);
  
})
it('acks the message', async () => {
  const {data, listener, msg} = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled();
})