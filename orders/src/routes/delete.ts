import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@ticketing.dev.causeleea/common';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  [param('id').custom((id) => mongoose.Types.ObjectId.isValid(id))],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;

    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price
      },
    });
    res.sendStatus(204);
  }
);

export { router as deleteOrderRouter };
