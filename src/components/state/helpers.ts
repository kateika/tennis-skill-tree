import { getOutgoers } from '@xyflow/react';
import { SkillNode, State } from './state';

export const getNodeById = (id: string, state: State): SkillNode | null => {
  return state.nodes.find((n) => n.id === id) || null;
};

export const hasCycle = (sourceId: string, targetId: string, state: State) => {
  if (sourceId === targetId) return true;
  const targetNode = getNodeById(targetId, state);

  const checkCycle = (node: SkillNode, visited = new Set()) => {
    // Early return if we have processed this subtree previously
    if (visited.has(node.id)) return false;

    visited.add(node.id);

    for (const dependent of getOutgoers(node, state.nodes, state.edges)) {
      // todo: comment a complex logic as requested
      if (dependent.id === sourceId) return true;
      if (checkCycle(dependent, visited)) return true;
    }

    return false;
  };

  return !checkCycle(targetNode);
};
