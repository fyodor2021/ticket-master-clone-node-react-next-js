import express from 'express';
import {body} from 'express-validator';
import {Request, Response} from 'express';
import {validateRequest}  from '@ticketing.dev.causeleea/common';
import {User} from '../models/user'
import { BadRequestError } from '@ticketing.dev.causeleea/common';
import {PasswordManager} from '../services/password-manager'
import { createSessionAndJwt } from '../services/jwt-manager';
const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
    ],validateRequest,
  async (req:Request,res:Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
      throw new BadRequestError("Invalid credentials")
    }
    const passwrodsMatch = await PasswordManager.compare(existingUser.password
      , password
    )
    if(!passwrodsMatch){
      throw new BadRequestError('Invalid credentials')
    }

    createSessionAndJwt(existingUser, req);
    res.status(200).send(existingUser)
})

export {router as signinRouter};