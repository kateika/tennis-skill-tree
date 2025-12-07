import React, { useCallback } from 'react';

import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import SkillNode from './skillNode/SkillNode';
import Edge from './edge/Edge';
import NodeConnectionLine from './nodeConnectionLine/NodeConnectionLine';
import AddNodeForm from './addNodeForm/AddNodeForm';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 150, y: 200 },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 40, y: 100 },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 200, y: 0 },
  },
];

/*@ts-ignore */
const initialEdges = [];

const connectionLineStyle = {
  stroke: '#b1b1b7',
};

const nodeTypes = {
  custom: SkillNode,
};

const edgeTypes = {
  floating: Edge,
};

const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
};

const EasyConnectExample = () => {
  /*@ts-ignore */
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  /*@ts-ignore */
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    /*@ts-ignore */
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        /*@ts-ignore */
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        /*@ts-ignore */
        connectionLineComponent={NodeConnectionLine}
        connectionLineStyle={connectionLineStyle}
      >
        <Background />
        <Panel><AddNodeForm /></Panel>
      </ReactFlow>
    </div>
  );
};

export default EasyConnectExample;
