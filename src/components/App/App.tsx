import React from 'react';
import { useMachine } from '@xstate/react';
import feedbackMachine from 'machines/feedback';
import useDebugGrid from 'hooks/useDebugGrid';
import Button from 'components/Button';

function App() {
  useDebugGrid();

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
