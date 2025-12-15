import { Action, defaultState, getNodeById, reducer, SkillNode, State } from '@components/state';

describe('state', () => {
  describe('reducer', () => {
    describe('ADD_NODE', () => {
      it('should add a node', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => 1);

        const initialState: State = { nodes: [], edges: [] };
        const action: Action = { type: 'ADD_NODE', label: 'test', description: 'new node' };
        const result = reducer(initialState, action);

        expect(result.nodes).toEqual([
          {
            id: 'n-1',
            type: 'custom',
            position: { x: 0, y: 100 },
            data: {
              label: 'test',
              description: 'new node',
              state: 'detached',
            },
          },
        ]);
      });
    });

    describe('RESET', () => {
      it('should reset to a default state', () => {
        const previousState: State = { nodes: [], edges: [] };
        const action: Action = { type: 'RESET' };
        const result = reducer(previousState, action);

        expect(result.nodes).toEqual(defaultState.nodes);
      });
    });

    describe('STATE_LOADED', () => {
      const initialState: State = { nodes: [], edges: [] };
      const action: Action = { type: 'STATE_LOADED', state: defaultState };
      const result = reducer(initialState, action);

      expect(result.nodes).toEqual(defaultState.nodes);
    });

    describe('UNLOCK_NODE', () => {
      it('should unlock a node and make its dependents available', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'available' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'locked' },
        };

        const initialState: State = {
          nodes: [node1, node2],
          edges: [{ id: 'e-1', source: 'n-1', target: 'n-2' }],
        };
        const action: Action = { type: 'UNLOCK_NODE', id: 'n-1' };
        const result = reducer(initialState, action);

        expect(result.nodes[0].data.state).toBe('unlocked');
        expect(result.nodes[1].data.state).toBe('available');
      });

      it('should not change state if node does not exist', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'available' },
        };

        const initialState: State = { nodes: [node1], edges: [] };
        const action: Action = { type: 'UNLOCK_NODE', id: 'invalid-id' };
        const result = reducer(initialState, action);

        expect(result).toEqual(initialState);
      });

      it('should unlock a node with multiple dependents', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'available' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'locked' },
        };

        const node3: SkillNode = {
          id: 'n-3',
          type: 'custom',
          position: { x: 200, y: 100 },
          data: { label: 'test3', description: 'node3', state: 'locked' },
        };

        const initialState: State = {
          nodes: [node1, node2, node3],
          edges: [
            { id: 'e-1', source: 'n-1', target: 'n-2' },
            { id: 'e-2', source: 'n-1', target: 'n-3' },
          ],
        };
        const action: Action = { type: 'UNLOCK_NODE', id: 'n-1' };
        const result = reducer(initialState, action);

        expect(result.nodes[0].data.state).toBe('unlocked');
        expect(result.nodes[1].data.state).toBe('available');
        expect(result.nodes[2].data.state).toBe('available');
      });
    });

    describe('CONNECT_NODES', () => {
      const node1: SkillNode = {
        id: 'n-1',
        type: 'custom',
        position: { x: 0, y: 100 },
        data: {
          label: 'test1',
          description: 'node1',
          state: 'detached',
        },
      };

      const node2: SkillNode = {
        id: 'n-2',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          label: 'test2',
          description: 'node2',
          state: 'detached',
        },
      };

      it('should connect two nodes and make target available when source is unlocked', () => {
        const unlockedNode1: SkillNode = { ...node1, data: { ...node1.data, state: 'unlocked' } };
        const initialState: State = { nodes: [unlockedNode1, node2], edges: [] };
        const action: Action = {
          type: 'CONNECT_NODES',
          connection: {
            source: unlockedNode1.id,
            target: node2.id,
            sourceHandle: 'whatever',
            targetHandle: 'whatever',
          },
        };
        const result = reducer(initialState, action);

        expect(result.edges).toHaveLength(1);
        expect(result.nodes[0].data.state).toBe('unlocked');
        expect(result.nodes[1].data.state).toBe('available');
      });

      it('should not connect nodes if source or target does not exist', () => {
        const initialState: State = { nodes: [node1, node2], edges: [] };
        const action: Action = {
          type: 'CONNECT_NODES',
          connection: { source: 'invalid', target: node2.id, sourceHandle: 'whatever', targetHandle: 'whatever' },
        };
        const result = reducer(initialState, action);

        expect(result.edges).toHaveLength(0);
      });

      it('should lock the dependents after being unlocked if a new node was attached before the first node', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'detached' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'unlocked' },
        };

        const node3: SkillNode = {
          id: 'n-3',
          type: 'custom',
          position: { x: 200, y: 100 },
          data: { label: 'test3', description: 'node3', state: 'unlocked' },
        };

        const initialState: State = {
          nodes: [node1, node2, node3],
          edges: [{ id: 'e-1', source: 'n-2', target: 'n-3' }],
        };
        const action: Action = {
          type: 'CONNECT_NODES',
          connection: { source: 'n-1', target: 'n-2', sourceHandle: 'a', targetHandle: 'b' },
        };
        const result = reducer(initialState, action);

        expect(result.nodes[0].data.state).toBe('available');
        expect(result.nodes[1].data.state).toBe('locked');
        expect(result.nodes[2].data.state).toBe('locked');
      });

      it('should lock the dependents again after being available if a new node was attached before the first node', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'detached' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'available' },
        };

        const node3: SkillNode = {
          id: 'n-3',
          type: 'custom',
          position: { x: 200, y: 100 },
          data: { label: 'test3', description: 'node3', state: 'locked' },
        };

        const initialState: State = {
          nodes: [node1, node2, node3],
          edges: [{ id: 'e-1', source: 'n-2', target: 'n-3' }],
        };
        const action: Action = {
          type: 'CONNECT_NODES',
          connection: { source: 'n-1', target: 'n-2', sourceHandle: 'a', targetHandle: 'b' },
        };
        const result = reducer(initialState, action);

        expect(result.nodes[0].data.state).toBe('available');
        expect(result.nodes[1].data.state).toBe('locked');
        expect(result.nodes[2].data.state).toBe('locked');
      });

      it('should keep unlocked state of the parent node if the node is added to the middle of the tree', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'unlocked' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'unlocked' },
        };

        const node3: SkillNode = {
          id: 'n-3',
          type: 'custom',
          position: { x: 200, y: 100 },
          data: { label: 'test3', description: 'node3', state: 'available' },
        };

        const node4: SkillNode = {
          id: 'n-4',
          type: 'custom',
          position: { x: 250, y: 150 },
          data: { label: 'test4', description: 'node4', state: 'locked' },
        };

        const middleNode: SkillNode = {
          id: 'middle-node',
          type: 'custom',
          position: { x: 200, y: 100 },
          data: { label: 'middle-node', description: 'middle node', state: 'detached' },
        };

        const initialState: State = {
          nodes: [node1, node2, node3, node4, middleNode],
          edges: [
            { id: 'e-1', source: 'n-1', target: 'n-2' },
            { id: 'e-2', source: 'n-2', target: 'n-3' },
            { id: 'e-3', source: 'n-3', target: 'n-4' },
          ],
        };
        const action: Action = {
          type: 'CONNECT_NODES',
          connection: { source: 'middle-node', target: 'n-2', sourceHandle: 'a', targetHandle: 'b' },
        };
        const state = reducer(initialState, action);

        expect(getNodeById("n-1", state).data.state).toBe('unlocked');
        expect(getNodeById("middle-node", state).data.state).toBe('available');
        expect(getNodeById("n-2", state).data.state).toBe('locked');
        expect(getNodeById("n-3", state).data.state).toBe('locked');
        expect(getNodeById("n-4", state).data.state).toBe('locked');
      });

      it('should remain existing state of all parents if node is added after the last node', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'unlocked' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'available' },
        };

        const node3: SkillNode = {
          id: 'n-3',
          type: 'custom',
          position: { x: 200, y: 100 },
          data: { label: 'test3', description: 'node3', state: 'detached' },
        };

        const initialState: State = {
          nodes: [node1, node2, node3],
          edges: [{ id: 'e-1', source: 'n-1', target: 'n-2' }],
        };

        const action: Action = {
          type: 'CONNECT_NODES',
          connection: { source: 'n-2', target: 'n-3', sourceHandle: 'a', targetHandle: 'b' },
        };
        const result = reducer(initialState, action);

        /**expected failure due to the bag in state.ts */
        expect(result.nodes[0].data.state).toBe('unlocked');
        expect(result.nodes[1].data.state).toBe('available');
        expect(result.nodes[2].data.state).toBe('locked');
      });
    });

    describe('ON_NODES_CHANGE', () => {
      it('should apply node changes to the state', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: {
            label: 'test1',
            description: 'node1',
            state: 'available',
          },
        };

        const initialState: State = { nodes: [node1], edges: [] };
        const action: Action = {
          type: 'ON_NODES_CHANGE',
          changes: [{ type: 'position', id: 'n-1', position: { x: 50, y: 150 } }],
        };
        const result = reducer(initialState, action);

        expect(result.nodes[0].position).toEqual({ x: 50, y: 150 });
      });

      it('should handle multiple node changes', () => {
        const node1: SkillNode = {
          id: 'n-1',
          type: 'custom',
          position: { x: 0, y: 100 },
          data: { label: 'test1', description: 'node1', state: 'available' },
        };

        const node2: SkillNode = {
          id: 'n-2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'test2', description: 'node2', state: 'locked' },
        };

        const initialState: State = { nodes: [node1, node2], edges: [] };
        const action: Action = {
          type: 'ON_NODES_CHANGE',
          changes: [
            { type: 'position', id: 'n-1', position: { x: 25, y: 75 } },
            { type: 'position', id: 'n-2', position: { x: 125, y: 125 } },
          ],
        };
        const result = reducer(initialState, action);

        expect(result.nodes[0].position).toEqual({ x: 25, y: 75 });
        expect(result.nodes[1].position).toEqual({ x: 125, y: 125 });
      });
    });

    describe('ON_EDGES_CHANGE', () => {
      it('should apply edge changes to the state', () => {
        const edge = { id: 'e-1', source: 'n-1', target: 'n-2' };
        const initialState: State = { nodes: [], edges: [edge] };
        const action: Action = {
          type: 'ON_EDGES_CHANGE',
          changes: [{ type: 'select', id: 'e-1', selected: true }],
        };
        const result = reducer(initialState, action);

        expect(result.edges).toHaveLength(1);
      });

      it('should handle multiple edge changes', () => {
        const edge1 = { id: 'e-1', source: 'n-1', target: 'n-2' };
        const edge2 = { id: 'e-2', source: 'n-2', target: 'n-3' };
        const initialState: State = { nodes: [], edges: [edge1, edge2] };
        const action: Action = {
          type: 'ON_EDGES_CHANGE',
          changes: [
            { type: 'select', id: 'e-1', selected: true },
            { type: 'select', id: 'e-2', selected: false },
          ],
        };
        const result = reducer(initialState, action);

        expect(result.edges).toHaveLength(2);
      });
    });

    describe('default case', () => {
      it('should log error and return previous state for unknown action', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const previousState: State = { nodes: [], edges: [] };
        /*@ts-ignore passing invalid type on purpose */
        const unknownAction = { type: 'UNKNOWN_ACTION' } as Action;

        const result = reducer(previousState, unknownAction as any);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown action', unknownAction);
        expect(result).toEqual(previousState);
        consoleErrorSpy.mockRestore();
      });
    });
  });
});
