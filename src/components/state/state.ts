import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from '@xyflow/react';
import { defaultState } from './defaults';
export { Edge } from '@xyflow/react';

type SkillNodeData = {
  label: string;
  description: string;
  state: 'available' | 'unlocked' | 'locked' | 'detached';
};

export type SkillNode = Node<SkillNodeData>;

export type State = {
  nodes: SkillNode[];
  edges: Edge[];
};

export type Action =
  | { type: 'RESET' }
  | { type: 'STATE_LOADED'; state: State }
  | { type: 'UNLOCK_NODE'; id: string }
  | { type: 'ADD_NODE'; label: string; description: string }
  | { type: 'CONNECT_NODES'; connection: Connection }
  | { type: 'ON_NODES_CHANGE'; changes: NodeChange<SkillNode>[] }
  | { type: 'ON_EDGES_CHANGE'; changes: EdgeChange[] };

export const initialState: State = {
  nodes: [],
  edges: [],
};

export const reducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case 'RESET':
      return defaultState;
    case 'STATE_LOADED':
      return action.state;
    case 'ON_NODES_CHANGE': {
      return { ...prevState, nodes: applyNodeChanges(action.changes, prevState.nodes) };
    }
    case 'ON_EDGES_CHANGE': {
      return { ...prevState, edges: applyEdgeChanges(action.changes, prevState.edges) };
    }
    case 'ADD_NODE': {
      const nodes = prevState.nodes;
      const { label, description } = action;
      const lastNode = nodes[nodes.length - 1];
      const nextCoordinateX = lastNode?.position.x ?? 0;
      const nextCoordinateY = (lastNode?.position.y ?? 0) + 100;

      // create and add a new node
      const node: SkillNode = {
        id: `n-${Date.now()}`,
        type: 'custom',
        position: { x: nextCoordinateX, y: nextCoordinateY },
        data: { label, description, state: 'detached' },
      };

      return { ...prevState, nodes: [...nodes, node] };
    }
    case 'UNLOCK_NODE': {
      const id = action.id;
      const { nodes, edges } = prevState;
      const node = nodes.find((n) => n.id === id);
      if (!node) {
        return prevState;
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

      return { ...prevState, nodes: applyNodeChanges(changes, nodes) };
    }
    case 'CONNECT_NODES': {
      const { nodes, edges } = prevState;
      const { source, target } = action.connection;

      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);
      const changes: NodeChange<SkillNode>[] = [];

      if (sourceNode && targetNode) {
        // we don't want to set node to be "available" if it was already previously unlocked
        const newTargetNodeState =
          sourceNode.data.state === 'unlocked'
            ? targetNode.data.state === 'unlocked'
              ? 'unlocked'
              : 'available'
            : 'locked';

        changes.push({
          type: 'replace',
          id: targetNode.id,
          item: { ...targetNode, data: { ...targetNode.data, state: newTargetNodeState } },
        });

        if (sourceNode.data.state === 'detached') {
          changes.push({
            type: 'replace',
            id: sourceNode.id,
            item: { ...sourceNode, data: { ...sourceNode.data, state: 'available' } },
          });
        }
      }

      return { ...prevState, edges: addEdge(action.connection, edges), nodes: applyNodeChanges(changes, nodes) };
    }
    default: {
      console.error('Unknown action', action);
      return prevState;
    }
  }
};
