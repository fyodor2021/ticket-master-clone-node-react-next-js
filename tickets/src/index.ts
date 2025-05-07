import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper as natsClient, natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
const start = async () => {
  console.log('strating.....')
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY not defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not defined');
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID not defined');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID not defined');
  if (!process.env.NATS_URI) throw new Error('NATS_URI not defined');

  try {
    
    await natsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URI)
    natsClient.client.on('close', () =>{
      console.log('NATS connection closed');
      process.exit();
    })
    process.on('SIGINT',() => {natsClient.client.close();})
    process.on('SIGTERM',() => {natsClient.client.close();})

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
  } catch (e) {
    console.log(e);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!!!!!!!');
  });
};

start();
