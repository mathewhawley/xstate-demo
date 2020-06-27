import React from 'react';
import { useMachine } from '@xstate/react';
import feedbackMachine from 'machines/feedback';
import useDebugGrid from 'hooks/useDebugGrid';
import Layout from 'components/Layout';
import Button from 'components/Button';

function App() {
  useDebugGrid();

  // @ts-ignore
  const [state, send] = useMachine(feedbackMachine);

  return (
    <Layout>
      <div className="mv3">
        <Button variant="standard" onClick={() => send('OPEN')}>
          Open
        </Button>
      </div>
    </Layout>
  );
}

export default App;
