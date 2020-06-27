import React from 'react';
import useDebugGrid from 'hooks/useDebugGrid';
import Layout from 'components/Layout';
import Feedback from 'components/Feedback/Feedback';

function App() {
  useDebugGrid();

  return (
    <Layout>
      <div className="pv3">
        <Feedback />
      </div>
    </Layout>
  );
}

export default App;
