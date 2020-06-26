import React from 'react';
import { Machine } from 'xstate';
import { createModel } from '@xstate/test';
// @ts-ignore - missing definitions for RTL :(
import { render, fireEvent } from '@testing-library/react';
import App from 'components/App';

import type { FeedbackSchema, FeedbackEvent, FeedbackContext } from 'machines/feedback';

const testMachine = Machine<FeedbackContext, FeedbackSchema, FeedbackEvent>({
  id: 'feedback',
  initial: 'idle',
  states: {
    idle: {},
    prompt: {},
    feedback: {},
    thanks: {},
  },
});

const testModel = createModel<any>(testMachine).withEvents({
  OPEN: ({ getByText }) => {
    fireEvent.click(getByText('Open'));
  },
});

const testPlans = testModel.getSimplePathPlans();

testPlans.forEach((plan) => {
  describe(plan.description, () => {
    plan.paths.forEach((path) => {
      it(path.description, () => {
        const result = render(<App />);
        path.test(result);
      });
    });
  });
});

it('coverage', () => {
  testModel.testCoverage();
});
