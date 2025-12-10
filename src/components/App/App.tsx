import React from 'react';
import { useCallback, useEffect } from 'react';
import {
  addEdge,
  applyNodeChanges,
  Background,
  Connection,
  Edge,
  getOutgoers,
  Node,
  NodeChange,
  OnConnect,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState
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
      label: 'Tennis Basics 1',
      description: 'Learn the core strokes such as forehand and backhand.',
      state: "available",
    }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: POSITION_SHIFT.x, y: POSITION_SHIFT.y },
    data: {
      label: 'Tennis Basics 2',
      description: 'Learn how to toss the ball and serve.',
      state: "locked",
    }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: POSITION_SHIFT.x, y: 2 * POSITION_SHIFT.y },
    data: {
      label: 'Tennis Basics 3',
      description: 'Practice eye-ball coordination.',
      state: "locked",
    }
  }
]

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2"
  },
  {
    id: "2-3",
    source: "2",
    target: "3"
  }
];

// todo: final clean up (for example, to remove cypress files etc.)
// todo: write unit tests
// todo: ?record a video to attach to the Readme file?
const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SkillNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (newEdge) => {
      setEdges((edges) => addEdge(newEdge, edges));

      setNodes((nodes) => {
        const sourceNode = nodes.find((n) => n.id === newEdge.source);
        const targetNode = nodes.find((n) => n.id === newEdge.target);
        const changes: NodeChange<Node<SkillNodeData>>[] = [];

        if (sourceNode && targetNode) {
          // we don't want to set node to be "available" if it was already previously unlocked
          const newTargetNodeState = sourceNode.data.state === 'unlocked' ? (targetNode.data.state === "unlocked" ? "unlocked" : "available") : 'locked';

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

    }, [setEdges, setNodes, nodes]);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (connection.target === connection.source) return false;

      const target = nodes.find((node) => node.id === connection.target);

      const hasCycle = (node: Node, visited = new Set()) => {
        // Early return if we have processed this subtree previously
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const dependent of getOutgoers(node, nodes, edges)) {
          // todo: comment a complex logic as requested
          if (dependent.id === connection.source) return true;
          if (hasCycle(dependent, visited)) return true;
        }

        return false;
      };

      return !hasCycle(target);
    },
    [nodes, edges],
  );

  // Restore app state on load or set up with initial nodes
  useEffect(() => {
    const savedData = localStorage.getItem('skill-builder');
    if (savedData) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skill-builder', JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // todo: if I move the button to be a separate component, this logic should go there
  const onReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

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
          <button type="button" className='clear-button' onClick={onReset}>Reset skill tree</button>
        </Panel>
      </ReactFlow>
    </main>
  );
};

export default App;