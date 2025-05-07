import { TicketUpdatedEvent } from "@ticketing.dev.causeleea/common";
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const userId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 19,
  })
  await ticket.save();
  const updatedData: TicketUpdatedEvent['data'] = {
    id: ticketId,
    title: 'concert',
    price: 220,
    userId: userId,
    version: ticket.version + 1,
  }
// @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {listener, ticket, msg, updatedData}
}


it('creates and saves a ticket', async () => {
   const {listener, ticket, msg, updatedData} = await setup()

   await listener.onMessage(updatedData, msg);

   const updatedTicket = await Ticket.findById(ticket.id)
    console.log(updatedTicket)
   expect(updatedTicket!.title).toEqual(updatedData.title);
   expect(updatedTicket!.price).toEqual(updatedData.price);
   expect(updatedTicket!.version).toEqual(updatedData.version);
  
})

it('acks the message', async () => {
  const {updatedData, listener, msg} = await setup();

  await listener.onMessage(updatedData, msg)

  expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if the version number is out of sync', async () => {
  const {updatedData, listener,ticket, msg} = await setup();
  updatedData.version = 10;
  try{
    await listener.onMessage(updatedData, msg)
  }catch(err) {

  }

  expect(msg.ack).not.toHaveBeenCalled();

})
