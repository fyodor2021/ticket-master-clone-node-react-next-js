import jwt from 'jsonwebtoken'
import { UserDoc } from '../models/user'
import {Request} from 'express'


const createSessionAndJwt = (user: UserDoc,req: Request) => {
  if(!process.env.JWT_KEY){
    throw new Error('kljasdf ')
  }
  const userjwt =  jwt.sign({id: user?.id, email: user?.email}, process.env.JWT_KEY);
  req.session = {
    jwt: userjwt
  }
}


const validateToken = (token: string) => {
  let payload
  try{
    payload = jwt.verify(token, process.env.JWT_KEY!)
  }catch(err){
    console.log(err)
  }
  return payload;
}


export {createSessionAndJwt,validateToken}