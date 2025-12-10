import { Node, Edge } from '@xyflow/react';
export { Edge } from '@xyflow/react';

type SkillNodeData = {
  label: string;
  description: string;
  state: 'available' | 'unlocked' | 'locked' | 'detached';
};

export type SkillNode = Node<SkillNodeData>;

export type State = {
  nodes: SkillNode[],
  edges: Edge[]
}
