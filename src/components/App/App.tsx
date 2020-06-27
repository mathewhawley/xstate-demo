import React from 'react';
import { useMachine } from '@xstate/react';
import feedbackMachine from 'machines/feedback';
import useDebugGrid from 'hooks/useDebugGrid';
import Layout from 'components/Layout';
import Button from 'components/Button';
import Modal, { ModalHeader, ModalFooter, ModalBody } from 'components/Modal';

function App() {
  useDebugGrid();

  const [state, send] = useMachine(feedbackMachine);

  const modalTrigger = (
    <Button variant="primary" onClick={() => send('OPEN')} qaHook="modal-trigger">
      Open
    </Button>
  );

  return (
    <Layout>
      <div className="mv3">
        <Modal
          onClose={() => send('CLOSE')}
          isOpen={state.matches('active')}
          trigger={modalTrigger}
        >
          <ModalHeader>
            <h2 className="ma0 fw4 lh-solid f4" data-testid="modal-heading-copy">
              {state.matches({ active: 'prompt' }) && 'How was your experience?'}
              {state.matches({ active: 'thanks' }) && 'Thanks for participating!'}
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="ma0 lh-copy" data-testid="modal-body-copy">
              Donec sed magna vel dui eleifend varius eu sit amet nisl. In placerat ornare nisl, ut
              dignissim ligula euismod quis. Etiam vestibulum purus sit amet ligula varius sodales.
              Cras vel fermentum massa, quis scelerisque ipsum. Donec arcu felis, sodales quis
              ligula sit amet, accumsan facilisis lacus.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="mw5-ns center">
              <div className="fl w-50 pr2">
                <Button
                  fullWidth
                  variant="error"
                  onClick={() => send('CLOSE')}
                  qaHook="modal-btn-bad"
                >
                  Bad
                </Button>
              </div>
              <div className="fl w-50 pl2">
                <Button
                  fullWidth
                  variant="new"
                  onClick={() => send('CLICK_GOOD')}
                  qaHook="modal-btn-good"
                >
                  Good
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </Layout>
  );
}

export default App;
