import express,{Request, Response} from 'express'
import mongoose from 'mongoose'
import { NotAuthorizedError, NotFoundError, requireAuth } from '@ticketing.dev.causeleea/common';
import { Order } from '../models/order';
import { param } from 'express-validator';

const router = express.Router();

router.get('/api/orders/:id',requireAuth,[
  param('id').custom((id) => mongoose.Types.ObjectId.isValid(id))
], async (req:Request, res: Response) =>{
  const order = await Order.findById(req.params.id).populate('ticket')
  if(!order){
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser?.id){
    throw new NotAuthorizedError();
  }
  res.send(order);
})

export {router as showOrderRouter}