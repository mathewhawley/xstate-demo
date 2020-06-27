import { MachineConfig } from 'xstate';

type FeedbackSchema = {
  states: {
    closed: {};
    opened: {
      states: {
        prompt: {};
        thanks: {};
        feedback: {};
      };
    };
  };
};

type FeedbackContext = {
  input: string | null;
};

type FeedbackEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'OVERLAY' }
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
      },
      states: {
        prompt: {
          on: {
            GOOD: 'thanks',
            BAD: 'feedback',
          },
        },
        thanks: {},
        feedback: {},
      },
    },
  },
};

export type { FeedbackSchema, FeedbackContext, FeedbackEvent };
export default config;
