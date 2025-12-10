import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
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
  | { type: 'UNLOCK_NODE'; id: string }
  | { type: 'ADD_NODE'; label: string; description: string }
  | { type: 'CONNECT_NODES'; sourceId: string; targetId: string }
  | { type: 'ON_NODES_CHANGE'; changes: NodeChange<SkillNode>[] }
  | { type: 'ON_EDGES_CHANGE'; changes: EdgeChange[] }
  | { type: 'SET_NODES'; nodes: SkillNode[] }
  | { type: 'SET_EDGES'; edges: Edge[] };

export const initialState: State = {
  nodes: [],
  edges: [],
};

export const reducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case 'SET_NODES': {
      return { ...prevState, nodes: action.nodes };
    }
    case 'SET_EDGES': {
      return { ...prevState, edges: action.edges };
    }
    case 'ON_NODES_CHANGE': {
      return { ...prevState, nodes: applyNodeChanges(action.changes, prevState.nodes) };
    }
    case 'ON_EDGES_CHANGE': {
      return { ...prevState, edges: applyEdgeChanges(action.changes, prevState.edges) };
    }
    default: {
      console.error('Unknown action', action);
      return prevState;
    }
  }
};
