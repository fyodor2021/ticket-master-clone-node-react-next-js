import { Stan } from 'node-nats-streaming';
import { walkUpBindingElementsAndPatterns } from 'typescript';

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
