import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '@ticketing.dev.causeleea/common';
import { NotFoundError } from '@ticketing.dev.causeleea/common';
import cookieSession from 'cookie-session';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,
}));
//process.env.NODE_ENV !== 'test'
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*', async() => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};