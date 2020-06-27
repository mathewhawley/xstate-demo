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
    <Button variant="standard" onClick={() => send('OPEN')}>
      Open
    </Button>
  );

  return (
    <Layout>
      <div className="mv3">
        <Modal isOpen trigger={modalTrigger}>
          <ModalHeader />
          <ModalBody />
          <ModalFooter />
        </Modal>
      </div>
    </Layout>
  );
}

export default App;
