import { Machine } from 'xstate';
import config from './config';

export type { FeedbackEvent, FeedbackSchema, FeedbackContext } from './config';

export default Machine(config);
