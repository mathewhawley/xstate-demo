import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import feedbackMachine from 'machines/feedback';
import Button from 'components/Button';
import Modal, { ModalHeader, ModalFooter, ModalBody } from 'components/Modal';

function Feedback() {
  const [state, send] = useMachine(feedbackMachine);
  const [feedback, setFeedback] = useState('');

  const modalHeading = (() => {
    switch (true) {
      case state.matches({ opened: 'prompt' }): {
        return 'How was your experience?';
      }
      case state.matches({ opened: 'thanks' }): {
        return 'Thanks for participating!';
      }
      case state.matches({ opened: 'form' }): {
        return 'We would love to hear your feedback.';
      }
    }
  })();

  return (
    <>
      <Button variant="primary" onClick={() => send('OPEN')} qaHook="feedback-trigger">
        Open
      </Button>
      <Modal
        isOpen={state.matches('opened')}
        onClickOverlay={() => send('OVERLAY')}
        onKeyEsc={() => send('KEY_ESC')}
      >
        <ModalHeader>
          <h2 className="ma0 fw4 lh-solid f4">{modalHeading}</h2>
        </ModalHeader>

        <ModalBody>
          {state.matches({ opened: 'prompt' }) && (
            <p className="ma0 lh-copy measure center">
              Donec sed magna vel dui eleifend varius eu sit amet nisl. In placerat ornare nisl, ut
              dignissim ligula euismod quis. Etiam vestibulum purus sit amet ligula varius sodales.
              Cras vel fermentum massa, quis scelerisque ipsum. Donec arcu felis, sodales quis
              ligula sit amet, accumsan facilisis lacus.
            </p>
          )}

          {state.matches({ opened: 'thanks' }) && (
            <p className="ma0 lh-copy measure center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec orci id massa lacinia
              consectetur non non metus. Pellentesque in sem sed lacus elementum vulputate.
            </p>
          )}

          {state.matches({ opened: 'form' }) && (
            <form>
              <label htmlFor="feedback-input" className="db mb2 f6 b">
                Please tell us why:
              </label>
              <textarea
                id="feedback-input"
                className="db border-box w-100 measure ba b--black-20 pa2 br2 mb2"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                data-testid="feedback-input"
              />
            </form>
          )}
        </ModalBody>

        <ModalFooter>
          {state.matches({ opened: 'prompt' }) && (
            <div className="mw5-ns center">
              <div className="fl w-50 pr2">
                <Button
                  fullWidth
                  variant="error"
                  onClick={() => send('BAD')}
                  qaHook="feedback-btn-bad"
                >
                  Bad
                </Button>
              </div>
              <div className="fl w-50 pl2">
                <Button
                  fullWidth
                  variant="new"
                  onClick={() => send('GOOD')}
                  qaHook="feedback-btn-good"
                >
                  Good
                </Button>
              </div>
            </div>
          )}

          {state.matches({ opened: 'thanks' }) && (
            <div className="mw4-ns center">
              <Button
                fullWidth
                variant="primary"
                onClick={() => send('DONE')}
                qaHook="feedback-btn-done"
              >
                Done
              </Button>
            </div>
          )}

          {state.matches({ opened: 'form' }) && (
            <div className="mw4-ns center">
              <Button
                fullWidth
                variant="primary"
                onClick={() => send({ type: 'SUBMIT', payload: feedback })}
                qaHook="feedback-btn-submit"
              >
                Submit
              </Button>
            </div>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Feedback;
