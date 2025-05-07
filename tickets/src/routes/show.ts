import express, { Response, Request } from 'express';
import {body} from 'express-validator'
import { currentUser, requireAuth, validateRequest,NotFoundError} from '@ticketing.dev.causeleea/common';
import { Ticket } from '../models/ticket';

const router = express.Router();
router.get('/api/tickets/:id', async (req:Request, res:Response) => {
  const ticket = await Ticket.findById(req.params.id)
  if(ticket){
    res.send(ticket);
  }else{
    throw new NotFoundError();
  }
})

export {router as showTicketRouter}