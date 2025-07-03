import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import DAGEditor from './components/DAGEditor/DAGEditor';
import 'reactflow/dist/style.css';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-50">
      <ReactFlowProvider>
        <DAGEditor />
      </ReactFlowProvider>
    </div>
  );
};

export default App;