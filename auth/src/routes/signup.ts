import express, {Request, Response} from 'express';
import {body,validationResult} from 'express-validator';
import {BadRequestError} from '@ticketing.dev.causeleea/common'
import { User } from '../models/user';
import {validateRequest} from '@ticketing.dev.causeleea/common'
import jwt from 'jsonwebtoken'
import { createSessionAndJwt } from '../services/jwt-manager';
const router = express.Router();

router.post('/api/users/signup',[
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({min: 4, max: 20})
  .withMessage('Password must be between 4 and 20 characters')
],validateRequest,async (req:Request ,res:Response) => {
  const {email, password} = req.body;

  const existingUser = await User.findOne({email});

  if(existingUser){
    throw new BadRequestError('Email in use')
  }

  let user;

  try{
    user = User.build({email, password})
  }catch(e){
    res.send(e)
  }

  if(user){

    await user.save();
    createSessionAndJwt(user,req)
  }
  res.status(201).send(user);
})

export {router as signupRouter};