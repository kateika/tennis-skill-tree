import { State } from './state';

export const defaultState: State = {
  nodes: [
    {
      id: '1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: 'Tennis Basics 1',
        description: 'Learn the core strokes such as forehand and backhand.',
        state: 'available',
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 0, y: 100 },
      data: {
        label: 'Tennis Basics 2',
        description: 'Learn how to toss the ball and serve.',
        state: 'locked',
      },
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 0, y: 200 },
      data: {
        label: 'Tennis Basics 3',
        description: 'Practice eye-ball coordination.',
        state: 'locked',
      },
    },
  ],
  edges: [
    {
      id: '1-2',
      source: '1',
      target: '2',
    },
    {
      id: '2-3',
      source: '2',
      target: '3',
    },
  ],
};
