import SkillNode from '../skillNode/SkillNode';
import Edge from '../edge/Edge';
import { MarkerType } from '@xyflow/react';

export const connectionLineStyle = {
  stroke: '#b1b1b7',
};

export const nodeTypes = {
  custom: SkillNode,
};

export const edgeTypes = {
  floating: Edge,
};

export const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
};
