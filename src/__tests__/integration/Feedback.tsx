import React from 'react';
import { Machine } from 'xstate';
import { createModel } from '@xstate/test';
import { cleanup, render, within, RenderResult } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import App from 'components/App';
import type { FeedbackSchema, FeedbackEvent, FeedbackContext } from 'machines/feedback';

const testMachine = Machine<FeedbackContext, FeedbackSchema, FeedbackEvent>({
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
      meta: {
        test: ({ queryByTestId }: RenderResult) => {
          expect(queryByTestId('feedback-trigger')).toBeInTheDocument();
          expect(queryByTestId('modal-overlay')).not.toBeInTheDocument();
        },
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
          meta: {
            test: () => {
              const { queryByText } = within(document.getElementById('modal')!);
              expect(queryByText('How was your experience?')).toBeInTheDocument();
              expect(queryByText('Donec sed magna vel dui', { exact: false })).toBeInTheDocument();
              expect(queryByText('Bad')).toBeInTheDocument();
              expect(queryByText('Good')).toBeInTheDocument();
            },
          },
        },
        thanks: {
          on: {
            DONE: '#feedback.closed',
          },
          meta: {
            test: () => {
              const { queryByText } = within(document.getElementById('modal')!);
              expect(queryByText('Thanks for participating!')).toBeInTheDocument();
              expect(queryByText('Lorem ipsum dolor sit', { exact: false })).toBeInTheDocument();
              expect(queryByText('Done')).toBeInTheDocument();
            },
          },
        },
        form: {
          on: {
            SUBMIT: [{ target: 'thanks', cond: (_, e) => e.payload.length > 0 }],
          },
          meta: {
            test: () => {
              const { queryByText, queryByLabelText } = within(document.getElementById('modal')!);
              expect(queryByText('We would love to hear your feedback.')).toBeInTheDocument();
              expect(queryByLabelText('Please tell us why:')).toBeInTheDocument();
              expect(queryByText('Submit')).toBeInTheDocument();
            },
          },
        },
      },
      meta: {
        test: () => {
          const { queryByTestId } = within(document.getElementById('modal')!);
          expect(queryByTestId('modal-overlay')).toBeInTheDocument();
          expect(queryByTestId('modal-panel')).toBeInTheDocument();
        },
      },
    },
  },
});

const testModel = createModel<RenderResult>(testMachine).withEvents({
  OPEN: ({ getByTestId }) => {
    fireEvent.click(getByTestId('feedback-trigger'));
  },
  KEY_ESC: ({ baseElement }) => {
    fireEvent.keyPress(baseElement, { key: 'Escape' });
  },
  OVERLAY: ({ getByTestId }) => {
    fireEvent.click(getByTestId('modal-overlay'));
  },
  SUBMIT: {
    exec: ({ getByTestId }, e) => {
      fireEvent.change(getByTestId('feedback-input'), {
        target: { value: e },
      });
      fireEvent.click(getByTestId('feedback-btn-submit'));
    },
    cases: [{ payload: 'test' }, { payload: '' }],
  },
  GOOD: ({ getByTestId }) => {
    fireEvent.click(getByTestId('feedback-btn-good'));
  },
  BAD: ({ getByTestId }) => {
    fireEvent.click(getByTestId('feedback-btn-bad'));
  },
});

const testPlans = testModel.getSimplePathPlans();

testPlans.forEach((plan) => {
  describe(plan.description, () => {
    let portalRoot: HTMLDivElement;

    beforeAll(() => {
      portalRoot = document.createElement('div');
      portalRoot.setAttribute('id', 'modal');
      document.body.appendChild(portalRoot);
    });

    afterAll(() => {
      document.body.removeChild(portalRoot);
      cleanup();
    });

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
