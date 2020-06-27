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
          expect(queryByTestId('modal-trigger')).toHaveTextContent('Open');
          expect(queryByTestId('modal-overlay')).not.toBeInTheDocument();
        },
      },
    },
    active: {
      on: {
        CLOSE: 'idle',
      },
      meta: {
        test: () => {
          const { queryByTestId } = within(document.getElementById('modal')!);
          expect(queryByTestId('modal-overlay')).toBeInTheDocument();
        },
      },
    },
    feedback: {},
    thanks: {},
  },
});

const testModel = createModel<RenderResult>(testMachine).withEvents({
  OPEN: ({ getByTestId }) => {
    fireEvent.click(getByTestId('modal-trigger'));
  },
  CLOSE: ({ getByTestId }) => {
    fireEvent.click(getByTestId('modal-overlay'));
  },
});

const testPlans = testModel.getSimplePathPlans();

testPlans.forEach((plan) => {
  describe(plan.description, () => {
    let portalRoot: HTMLDivElement;

    beforeEach(() => {
      portalRoot = document.createElement('div');
      portalRoot.setAttribute('id', 'modal');
      document.body.appendChild(portalRoot);
    });

    afterEach(() => {
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
