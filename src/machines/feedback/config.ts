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
            submitted: {};
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
  | { type: 'SUBMIT'; value: string }
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
          initial: 'clean',
          on: {
            SUBMIT: [
              { target: '.submitted', cond: (_, e) => e.value.trim().length > 0 },
              { target: '.invalid' },
            ],
          },
          states: {
            clean: {},
            invalid: {},
            submitted: {
              on: {
                '': '#opened.thanks',
              },
            },
          },
        },
      },
    },
  },
};

export type { FeedbackSchema, FeedbackEvent, FeedbackContext };
export default config;
