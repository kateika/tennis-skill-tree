import React, { useReducer } from 'react';
import { useCallback, useEffect } from 'react';
import {
  Background,
  IsValidConnection,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Panel,
  ReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.scss';

import NodeConnectionLine from '../nodeConnectionLine/NodeConnectionLine';
import AddNodeForm from '../addNodeForm/AddNodeForm';
import { connectionLineStyle, defaultEdgeOptions, nodeTypes, edgeTypes } from './setup';
import { AppContext, hasCycle, initialState, loadState, reducer, saveState, SkillNode } from '@components/state';

// todo: final clean up (for example, to remove cypress files etc.)
// todo: write unit tests
// todo: ?record a video to attach to the Readme file?
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onReset = () => dispatch({ type: 'RESET' });
  const addNode = (label: string, description: string) => dispatch({ type: 'ADD_NODE', label, description });
  const unlockNode = (id: string) => dispatch({ type: 'UNLOCK_NODE', id });

  // Restore app state on load or set up with initial nodes
  useEffect(() => dispatch({ type: 'STATE_LOADED', state: loadState() }), []);

  // Save on any change
  useEffect(() => saveState(state), [state]);

  // ReactFlow
  const onNodesChange: OnNodesChange<SkillNode> = (changes) => dispatch({ type: 'ON_NODES_CHANGE', changes });
  const onEdgesChange: OnEdgesChange = (changes) => dispatch({ type: 'ON_EDGES_CHANGE', changes });
  const onConnect: OnConnect = (connection) => dispatch({ type: 'CONNECT_NODES', connection });
  const isValidConnection: IsValidConnection = useCallback(
    (connection) => !hasCycle(connection.source, connection.target, state),
    [state],
  );

  return (
    <main className="main-canvas">
      <AppContext.Provider value={{ addNode, unlockNode }}>
        <ReactFlow
          nodes={state.nodes}
          onNodesChange={onNodesChange}
          edges={state.edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={NodeConnectionLine}
          connectionLineStyle={connectionLineStyle}
          isValidConnection={isValidConnection}
          elementsSelectable={false}
        >
          <Background />
          <Panel position="top-right">
            <AddNodeForm />
            <button type="button" className="clear-button" onClick={onReset}>
              Reset skill tree
            </button>
          </Panel>
        </ReactFlow>
      </AppContext.Provider>
    </main>
  );
};

export default App;
