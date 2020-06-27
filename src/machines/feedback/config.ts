import { MachineConfig } from 'xstate';

type FeedbackSchema = {
  states: {
    idle: {};
    active: {
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
  initial: 'idle',
  context: {
    input: null,
  },
  states: {
    idle: {
      on: {
        OPEN: 'active',
      },
    },
    active: {
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
        CLOSE: 'idle',
      },
    },
  },
};

export type { FeedbackSchema, FeedbackContext, FeedbackEvent };
export default config;
