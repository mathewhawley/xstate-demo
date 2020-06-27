import { MachineConfig } from 'xstate';

type FeedbackSchema = {
  states: {
    closed: {};
    opened: {
      states: {
        prompt: {};
        thanks: {};
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
  | { type: 'SUBMIT' }
  | { type: 'CLICK_GOOD' }
  | { type: 'CLICK_BAD' };

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
      initial: 'prompt',
      states: {
        prompt: {
          on: {
            CLICK_GOOD: 'thanks',
          },
        },
        thanks: {},
      },
      on: {
        CLOSE: 'closed',
      },
    },
  },
};

export type { FeedbackSchema, FeedbackContext, FeedbackEvent };
export default config;
