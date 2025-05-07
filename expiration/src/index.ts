import { natsWrapper as natsClient, natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {

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
  } catch (e) {
    console.log(e);
  }
};

start();
