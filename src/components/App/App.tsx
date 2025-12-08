import { useCallback } from 'react';
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  Node,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.scss';

import { SkillNodeData } from '../skillNode/SkillNode';
import NodeConnectionLine from '../nodeConnectionLine/NodeConnectionLine';
import AddNodeForm from '../addNodeForm/AddNodeForm';
import { connectionLineStyle, defaultEdgeOptions, nodeTypes, edgeTypes } from './setup';

const initialNodes: Node<SkillNodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: 'Tennis Basics',
      description: 'Learn the basic  and techniques of tennis.',
      state: "detached",
    }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 0, y: 100 },
    data: {
      label: 'Tennis Basics 2',
      description: 'Learn the core strokes.',
      state: "detached",
    }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 0, y: 200 },
    data: {
      label: 'Tennis Basics 3',
      description: 'Practice eye-ball coordination.',
      state: "detached",
    }
  }
];

// const initialNodes: Node<SkillNodeData>[] = [];

/*@ts-ignore */
// const initialEdges = [
//   {
//     id: 'e1-2',
//     source: '1',
//     target: '2',
//     type: 'floating',
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: 'e2-3',
//     source: '2',
//     target: '3',
//     type: 'floating',
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
// ];

const initialEdges = [];

const App = () => {
  /*@ts-ignore */
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  /*@ts-ignore */
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    /*@ts-ignore */
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // todo: clear input after submit
  // todo: add form validation (all fields required)
  // todo: instead of "drop here" text I should highlight the node where we can drop with css (probably checking on circular dependency at that time?)
  // todo: make a right panel with a form and drag and drop items (forehand, backend etc.) to create a node
  // todo: style the form
  // todo: fix all ts-ignore
  // todo: https://reactflow.dev/examples/nodes/connection-limit to help with circular dependencies?
  // todo: add a possibility to connect multiple nodes to one node
  // todo: final clean up

  return (
    <main className="main-canvas">
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
    </main>
  );
};

export default App;
