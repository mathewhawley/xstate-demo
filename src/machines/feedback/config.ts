import { MachineConfig } from 'xstate';

type FeedbackSchema = {
  states: {
    closed: {};
    opened: {
      states: {
        prompt: {};
        thanks: {};
        form: {
          states: {
            clean: {};
            invalid: {};
          };
        };
      };
    };
  };
};

type FeedbackEvent =
  | { type: 'OPEN' }
  | { type: 'OVERLAY' }
  | { type: 'KEY_ESC' }
  | { type: 'DONE' }
  | { type: 'SUBMIT'; payload: string }
  | { type: 'GOOD' }
  | { type: 'BAD' };

type FeedbackContext = {};

const config: MachineConfig<FeedbackContext, FeedbackSchema, FeedbackEvent> = {
  id: 'feedback',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPEN: 'opened',
      },
    },
    opened: {
      id: 'opened',
      initial: 'prompt',
      on: {
        OVERLAY: 'closed',
        KEY_ESC: 'closed',
      },
      states: {
        prompt: {
          on: {
            GOOD: 'thanks',
            BAD: 'form',
          },
        },
        thanks: {
          on: {
            DONE: '#feedback.closed',
          },
        },
        form: {
          id: 'form',
          initial: 'clean',
          on: {
            SUBMIT: [
              { target: 'thanks', cond: (_, e) => e.payload.length > 0 },
              { target: '.invalid' },
            ],
          },
          states: {
            clean: {},
            invalid: {},
          },
        },
      },
    },
  },
};

export type { FeedbackSchema, FeedbackEvent, FeedbackContext };
export default config;
