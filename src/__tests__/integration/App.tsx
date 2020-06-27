import React from 'react';
import { Machine } from 'xstate';
import { createModel } from '@xstate/test';
import { cleanup, render, within, RenderResult } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import App from 'components/App';
import type { FeedbackSchema, FeedbackEvent, FeedbackContext } from 'machines/feedback';

const testMachine = Machine<FeedbackContext, FeedbackSchema, FeedbackEvent>({
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
      meta: {
        test: ({ queryByTestId }: RenderResult) => {
          expect(queryByTestId('modal-trigger')).toBeInTheDocument();
          expect(queryByTestId('modal-overlay')).not.toBeInTheDocument();
        },
      },
    },
    active: {
      id: 'active',
      initial: 'prompt',
      states: {
        prompt: {
          on: {
            CLICK_GOOD: 'thanks',
          },
          meta: {
            test: () => {
              const { queryByTestId } = within(document.getElementById('modal')!);
              expect(queryByTestId('modal-overlay')).toBeInTheDocument();
              expect(queryByTestId('modal-panel')).toBeInTheDocument();
              expect(queryByTestId('modal-heading-copy')).toHaveTextContent(
                'How was your experience?'
              );
              expect(queryByTestId('modal-btn-bad')).toBeInTheDocument();
              expect(queryByTestId('modal-btn-good')).toBeInTheDocument();
            },
          },
        },
        thanks: {
          meta: {
            test: () => {
              const { queryByTestId } = within(document.getElementById('modal')!);
              expect(queryByTestId('modal-overlay')).toBeInTheDocument();
              expect(queryByTestId('modal-panel')).toBeInTheDocument();
              expect(queryByTestId('modal-heading-copy')).toHaveTextContent(
                'Thanks for participating!'
              );
            },
          },
        },
      },
      on: {
        CLOSE: 'idle',
      },
    },
  },
});

const testModel = createModel<RenderResult>(testMachine).withEvents({
  OPEN: ({ getByTestId }) => {
    fireEvent.click(getByTestId('modal-trigger'));
  },
  CLOSE: ({ getByTestId }) => {
    fireEvent.click(getByTestId('modal-overlay'));
  },
  CLICK_GOOD: ({ getByTestId }) => {
    fireEvent.click(getByTestId('modal-btn-good'));
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
  testModel.testCoverage({
    filter: (stateNode) => !!stateNode.meta,
  });
});
