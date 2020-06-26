import React from 'react';
import { useMachine } from '@xstate/react';
import feedbackMachine from 'machines/feedback';
import Button from 'components/Button';

function App() {
  const [state, send] = useMachine(feedbackMachine);
  return (
    <>
      <Button variant="standard" onClick={() => send('OPEN')}>
        Open
      </Button>
    </>
  );
}

export default App;
