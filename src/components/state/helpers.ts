import { getOutgoers, NodeChange } from '@xyflow/react';
import { SkillNode, SkillNodeState, State } from './state';

export const getNodeById = (id: string, state: State): SkillNode | null => {
  return state.nodes.find((n) => n.id === id) || null;
};

export const hasCycle = (sourceId: string, targetId: string, state: State) => {
  if (sourceId === targetId) return true;

  const targetNode = getNodeById(targetId, state);

  const checkCycle = (node: SkillNode, visited = new Set()): boolean => {
    // Early return if we have processed this subtree previously
    if (visited.has(node.id)) return false;

    visited.add(node.id);

    for (const child of getOutgoers(node, state.nodes, state.edges)) {
      if (child.id === sourceId) return true;
      if (checkCycle(child, visited)) return true;
    }

    return false;
  };

  return checkCycle(targetNode);
};

/**
 * Limit node state to parent node state enforcing the hierarchy: a child
 * cannot have a state "higher" than its parent.
 */
export const capNodeStateTo = (nodeState: SkillNodeState, parentNodeState: SkillNodeState): SkillNodeState => {
  switch (parentNodeState) {
    case 'unlocked':
      // both child and parent can be unlocked
      return nodeState === 'unlocked' ? 'unlocked' : 'available';
    case 'available':
      return 'locked';
    default:
      return 'locked';
  }
};

/**
 * Returns an array of `NodeChange` updating the subtree that starts at `node`
 * by capping its state to `parentNodeState`.
 */
export const capSubtreeState = (
  node: SkillNode,
  parentNodeState: SkillNodeState,
  graphState: State,
): NodeChange<SkillNode>[] => {
  const nodeState = capNodeStateTo(node.data.state, parentNodeState);

  const changes: NodeChange<SkillNode>[] = [replaceNodeState(node, nodeState)];

  for (const child of getOutgoers(node, graphState.nodes, graphState.edges)) {
    changes.push(...capSubtreeState(child, nodeState, graphState));
  }

  return changes;
};

export const makeAvailable = (node: SkillNode): NodeChange<SkillNode> =>
  replaceNodeState(node, node.data.state === 'unlocked' ? 'unlocked' : 'available');

export const makeUnlocked = (node: SkillNode): NodeChange<SkillNode> => replaceNodeState(node, 'unlocked');

/**
 * Creates a `NodeChange` that switched node state.
 */
export const replaceNodeState = (node: SkillNode, newState: SkillNodeState): NodeChange<SkillNode> => ({
  type: 'replace',
  id: node.id,
  item: { ...node, data: { ...node.data, state: newState } },
});
