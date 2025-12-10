import { Node } from '@xyflow/react';

type SkillNodeData = {
  label: string;
  description: string;
  state: 'available' | 'unlocked' | 'locked' | 'detached';
};

export type SkillNode = Node<SkillNodeData>;
