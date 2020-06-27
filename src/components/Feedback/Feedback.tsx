import React from 'react';
import { useMachine } from '@xstate/react';
import feedbackMachine from 'machines/feedback';
import Button from 'components/Button';
import Modal, { ModalHeader, ModalFooter, ModalBody } from 'components/Modal';

function Feedback() {
  const [state, send] = useMachine(feedbackMachine);

  const modalTrigger = (
    <Button variant="primary" onClick={() => send('OPEN')} qaHook="modal-trigger">
      Open
    </Button>
  );

  const modalHeading = (() => {
    switch (true) {
      case state.matches({ opened: 'prompt' }): {
        return 'How was your experience?';
      }
      case state.matches({ opened: 'thanks' }): {
        return 'Thanks for participating!';
      }
    }
  })();

  return (
    <Modal onClose={() => send('CLOSE')} isOpen={state.matches('opened')} trigger={modalTrigger}>
      <ModalHeader>
        <h2 className="ma0 fw4 lh-solid f4">{modalHeading}</h2>
      </ModalHeader>
      <ModalBody>
        {(state.matches({ opened: 'prompt' }) || state.matches({ opened: 'thanks' })) && (
          <p className="ma0 lh-copy">
            Donec sed magna vel dui eleifend varius eu sit amet nisl. In placerat ornare nisl, ut
            dignissim ligula euismod quis. Etiam vestibulum purus sit amet ligula varius sodales.
            Cras vel fermentum massa, quis scelerisque ipsum. Donec arcu felis, sodales quis ligula
            sit amet, accumsan facilisis lacus.
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="mw5-ns center">
          <div className="fl w-50 pr2">
            <Button fullWidth variant="error" onClick={() => send('CLOSE')} qaHook="modal-btn-bad">
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
  );
}

export default Feedback;
