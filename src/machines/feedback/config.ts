import { MachineConfig, TransitionConfig, EventObject } from 'xstate';

type FeedbackSchema = {
  states: {
    closed: {};
    opened: {
      states: {
        prompt: {};
        thanks: {};
        form: {};
      };
    };
  };
};

type FeedbackContext = {
  input: string | null;
};

type FeedbackEvent =
  | { type: 'OPEN' }
  | { type: 'OVERLAY' }
  | { type: 'KEY_ESC' }
  | { type: 'DONE' }
  | { type: 'SUBMIT' }
  | { type: 'GOOD' }
  | { type: 'BAD' };

const config: MachineConfig<FeedbackContext, FeedbackSchema, FeedbackEvent> = {
  id: 'feedback',
  initial: 'closed',
  context: {
    input: null,
  },
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
        form: {},
      },
    },
  },
};

export type { FeedbackSchema, FeedbackContext, FeedbackEvent };
export default config;
