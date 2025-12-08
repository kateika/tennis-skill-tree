import { useCallback, useEffect } from 'react';
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  Node,
  applyNodeChanges,
  NodeChange,
  Edge,
  EdgeChange,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.scss';

import { SkillNodeData } from '../skillNode/SkillNode';
import NodeConnectionLine from '../nodeConnectionLine/NodeConnectionLine';
import AddNodeForm from '../addNodeForm/AddNodeForm';
import { connectionLineStyle, defaultEdgeOptions, nodeTypes, edgeTypes } from './setup';
import { POSITION_SHIFT } from './constants';

const initialNodes: Node<SkillNodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: POSITION_SHIFT.x, y: 0 },
    data: {
      label: 'Tennis Basics',
      description: 'Learn the basic  and techniques of tennis.',
      state: "detached",
    }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: POSITION_SHIFT.x, y: POSITION_SHIFT.y },
    data: {
      label: 'Tennis Basics 2',
      description: 'Learn the core strokes.',
      state: "detached",
    }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: POSITION_SHIFT.x, y: 2 * POSITION_SHIFT.y },
    data: {
      label: 'Tennis Basics 3',
      description: 'Practice eye-ball coordination.',
      state: "detached",
    }
  }
]

const initialEdges: Edge[] = [];

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

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SkillNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodesChange = (changes: NodeChange<Node<SkillNodeData>>[]) => {
    // TODO: remove
    onNodesChange(changes);
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    console.log("Edges changed:", changes);
    onEdgesChange(changes);
  }

  // TODO: remove initial nodes setup
  // useEffect(() => {
  //   const initialNodes: Node<SkillNodeData>[] = [
  //     {
  //       id: '1',
  //       type: 'custom',
  //       position: { x: 0, y: 0 },
  //       data: {
  //         label: 'Tennis Basics',
  //         description: 'Learn the basic  and techniques of tennis.',
  //         state: "detached",
  //       }
  //     },
  //     {
  //       id: '2',
  //       type: 'custom',
  //       position: { x: 0, y: 100 },
  //       data: {
  //         label: 'Tennis Basics 2',
  //         description: 'Learn the core strokes.',
  //         state: "detached",
  //       }
  //     },
  //     {
  //       id: '3',
  //       type: 'custom',
  //       position: { x: 0, y: 200 },
  //       data: {
  //         label: 'Tennis Basics 3',
  //         description: 'Practice eye-ball coordination.',
  //         state: "detached",
  //       }
  //     }
  //   ]
  //   const initialEdges: Edge[] = [];

  //   setNodes(initialNodes);
  //   setEdges(initialEdges);
  // }, []);

  const onConnect = useCallback(
    /*@ts-ignore */
    (newEdge) => {
      setEdges((edges) => addEdge(newEdge, edges));

      setNodes((nodes) => {
        const sourceNode = nodes.find((n) => n.id === newEdge.source);
        const targetNode = nodes.find((n) => n.id === newEdge.target);
        const changes: NodeChange<Node<SkillNodeData>>[] = [];

        if (sourceNode && targetNode) {
          const newTargetNodeState = sourceNode.data.state === 'unlocked' ? 'available' : 'locked';

          changes.push({
            type: "replace",
            id: targetNode.id,
            item: { ...targetNode, data: { ...targetNode.data, state: newTargetNodeState } }
          });

          if (sourceNode.data.state === 'detached') {
            changes.push({
              type: "replace",
              id: sourceNode.id,
              item: { ...sourceNode, data: { ...sourceNode.data, state: 'available' } }
            });
          }
        }

        return applyNodeChanges(changes, nodes);
      });

    },
    [setEdges, setNodes, nodes]);

  // const onAddNode = useCallback(
  //   (label: string, description: string) => {
  //     const nextCoordinateX = nodes[nodes.length - 1]?.position.x || 0;
  //     const nextCoordinateY = nodes[nodes.length - 1]?.position.y + 100 || 0;

  //     const node: Node<SkillNodeData> = {
  //       id: `n-${Date.now()}`,
  //       type: "custom",
  //       position: { x: nextCoordinateX, y: nextCoordinateY },
  //       data: { label, description, state: "detached" },
  //     };

  //   }, [setNodes, nodes]);

  // todo: instead of "drop here" text I should highlight the node where we can drop with css (probably checking on circular dependency at that time?)
  // todo: make a right panel with a form and drag and drop items (forehand, backend etc.) to create a node
  // todo: fix all ts-ignore
  // todo: https://reactflow.dev/examples/nodes/connection-limit and https://reactflow.dev/examples/interaction/prevent-cycles to help with circular dependencies?
  // todo: add a possibility to connect multiple nodes to one node
  // todo: final clean up

  return (
    <main className="main-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
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
        <Panel position="top-right"><AddNodeForm /></Panel>
      </ReactFlow>
    </main>
  );
};

export default App;