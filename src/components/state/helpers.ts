import { getOutgoers, NodeChange } from '@xyflow/react';
import { SkillNode, SkillNodeState, State } from './state';

export const getNodeById = (id: string, state: State): SkillNode | null => {
  return state.nodes.find((n) => n.id === id) || null;
};

export const hasCycle = (sourceId: string, targetId: string, state: State) => {
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
 * Return all descendants of a target node.
 */
export const getDescendants = (node: SkillNode, state: State): SkillNode[] => {
  const descendants: SkillNode[] = [];

  for (const child of getOutgoers(node, state.nodes, state.edges)) {
    descendants.push(child, ...getDescendants(child, state));
  }

  return descendants;
};

/**
 * Switches node to available unless it was previously unlocked.
 */
export const makeAvailable = (node: SkillNode): NodeChange<SkillNode> =>
  replaceNodeState(node, node.data.state === 'unlocked' ? 'unlocked' : 'available');

export const makeLocked = (node: SkillNode): NodeChange<SkillNode> => replaceNodeState(node, 'locked');

export const makeUnlocked = (node: SkillNode): NodeChange<SkillNode> => replaceNodeState(node, 'unlocked');

/**
 * Creates a `NodeChange` that switched node state.
 */
const replaceNodeState = (node: SkillNode, newState: SkillNodeState): NodeChange<SkillNode> => ({
  type: 'replace',
  id: node.id,
  item: { ...node, data: { ...node.data, state: newState } },
});
