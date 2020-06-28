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
  states: {
    closed: {
      on: {
        OPEN: 'opened',
      },
      meta: {
        test: ({ getByTestId, queryByTestId }: RenderResult) => {
          expect(getByTestId('feedback-trigger'));
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
              const { getByText } = within(document.getElementById('modal')!);
              expect(getByText('How was your experience?'));
              expect(getByText('Donec sed magna vel dui', { exact: false }));
              expect(getByText('Bad'));
              expect(getByText('Good'));
            },
          },
        },
        thanks: {
          on: {
            DONE: '#feedback.closed',
          },
          meta: {
            test: () => {
              const { getByText } = within(document.getElementById('modal')!);
              expect(getByText('Thanks for participating!'));
              expect(getByText('Lorem ipsum dolor sit', { exact: false }));
              expect(getByText('Done'));
            },
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
            clean: {
              meta: {
                test: () => {
                  const { queryByText } = within(document.getElementById('modal')!);
                  expect(queryByText('Required')).not.toBeInTheDocument();
                },
              },
            },
            invalid: {
              meta: {
                test: () => {
                  const { getByText } = within(document.getElementById('modal')!);
                  expect(getByText('Required'));
                },
              },
            },
          },
          meta: {
            test: () => {
              const { getByText, getByLabelText } = within(document.getElementById('modal')!);
              expect(getByText('We would love to hear your feedback.'));
              expect(getByLabelText('Please tell us why:'));
              expect(getByText('Submit'));
            },
          },
        },
      },
      meta: {
        test: () => {
          const { getByTestId } = within(document.getElementById('modal')!);
          expect(getByTestId('modal-overlay'));
          expect(getByTestId('modal-panel'));
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
