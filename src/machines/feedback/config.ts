import { MachineConfig } from 'xstate';

type FeedbackSchema = {
  states: {
    idle: {};
    prompt: {};
    feedback: {};
    thanks: {};
  };
};

type FeedbackContext = {
  input: string | null;
};

type FeedbackEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'CLICK_GOOD' }
  | { type: 'CLICK_BAD' };

const config: MachineConfig<FeedbackContext, FeedbackSchema, FeedbackEvent> = {
  id: 'feedback',
  initial: 'idle',
  states: {
    idle: {},
    prompt: {},
    feedback: {},
    thanks: {},
  },
};

export type { FeedbackSchema, FeedbackContext, FeedbackEvent };
export default config;
