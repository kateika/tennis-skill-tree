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

import NodeConnectionLine from '../nodeConnectionLine/NodeConnectionLine';
import AddNodeForm from '../addNodeForm/AddNodeForm';
import { connectionLineStyle, defaultEdgeOptions, nodeTypes, edgeTypes } from './setup';
import { POSITION_SHIFT } from './constants';
import { AppContext, defaultState, loadState, saveState, SkillNode } from '@components/state';

// todo: final clean up (for example, to remove cypress files etc.)
// todo: write unit tests
// todo: ?record a video to attach to the Readme file?
const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<SkillNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect: OnConnect = useCallback(
    (newEdge) => {
      setEdges((edges) => addEdge(newEdge, edges));

      setNodes((nodes) => {
        const sourceNode = nodes.find((n) => n.id === newEdge.source);
        const targetNode = nodes.find((n) => n.id === newEdge.target);
        const changes: NodeChange<SkillNode>[] = [];

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
    const { nodes, edges } = loadState();
    setNodes(nodes);
    setEdges(edges);
  }, []);

  useEffect(() => {
    saveState({ nodes, edges });
  }, [nodes, edges]);

  // todo: if I move the button to be a separate component, this logic should go there
  const onReset = useCallback(() => {
    const { nodes, edges } = defaultState;
    setNodes(nodes);
    setEdges(edges);
  }, [setNodes, setEdges]);

  const addNode = (label: string, description: string) => {
    const lastNode = nodes[nodes.length - 1];
    const nextCoordinateX = (lastNode?.position.x ?? 0) + POSITION_SHIFT.x;
    const nextCoordinateY = (lastNode?.position.y ?? 0) + POSITION_SHIFT.y;

    // create and add a new node
    const node: SkillNode = {
      id: `n-${Date.now()}`,
      type: 'custom',
      position: { x: nextCoordinateX, y: nextCoordinateY },
      data: { label, description, state: 'detached' },
    };

    return setNodes((nodes) => [...nodes, node]);
  };

  const unlockNode = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) {
      return nodes;
    }

    const changes: NodeChange<SkillNode>[] = [
      {
        type: 'replace',
        id,
        item: { ...node, data: { ...node.data, state: 'unlocked' } },
      },
    ];

    // todo: replace with getOutgoers
    const dependenIds: string[] = [];
    edges.forEach((edge) => {
      if (edge.source === id) {
        dependenIds.push(edge.target);
      }
    });

    dependenIds.forEach((depId) => {
      const node = nodes.find((n) => n.id === depId);
      if (!node) {
        return;
      }
      changes.push({
        type: 'replace',
        id: depId,
        item: {
          ...node,
          data: {
            ...node.data,
            state: node.data.state === 'unlocked' ? 'unlocked' : 'available',
          },
        },
      });
    });

    setNodes(applyNodeChanges(changes, nodes));
  };

  return (
    <main className="main-canvas">
      <AppContext.Provider value={{ addNode, unlockNode }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
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
