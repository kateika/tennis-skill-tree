import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  getOutgoers,
} from '@xyflow/react';
import { defaultState } from './defaults';
import { getNodeById, makeAvailable, makeLocked, makeUnlocked } from './helpers';
export { Edge } from '@xyflow/react';

export type SkillNodeState = 'available' | 'unlocked' | 'locked' | 'detached';

type SkillNodeData = {
  label: string;
  description: string;
  state: SkillNodeState;
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
      const node = getNodeById(id, prevState);

      if (!node) return prevState;

      const changes: NodeChange<SkillNode>[] = [makeUnlocked(node)];

      for (const dependent of getOutgoers(node, nodes, edges)) {
        changes.push(makeAvailable(dependent));
      }

      return { ...prevState, nodes: applyNodeChanges(changes, nodes) };
    }
    case 'CONNECT_NODES': {
      const { nodes, edges } = prevState;
      const { source, target } = action.connection;

      const sourceNode = getNodeById(source, prevState);
      const targetNode = getNodeById(target, prevState);

      if (!sourceNode || !targetNode) return prevState;

      const isSourceUnlocked = sourceNode.data.state === 'unlocked';

      const changes: NodeChange<SkillNode>[] = [
        makeAvailable(sourceNode),
        isSourceUnlocked ? makeAvailable(targetNode) : makeLocked(targetNode),
      ];

      return { ...prevState, edges: addEdge(action.connection, edges), nodes: applyNodeChanges(changes, nodes) };
    }
    case 'ON_NODES_CHANGE': {
      // Needed to support React Flow controlled mode
      return { ...prevState, nodes: applyNodeChanges(action.changes, prevState.nodes) };
    }
    case 'ON_EDGES_CHANGE': {
      // Needed to support React Flow controlled mode
      return { ...prevState, edges: applyEdgeChanges(action.changes, prevState.edges) };
    }
    default: {
      console.error('Unknown action', action);
      return prevState;
    }
  }
};
