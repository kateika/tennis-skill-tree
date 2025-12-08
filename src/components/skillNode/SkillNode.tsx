import { Handle, Position, useConnection, useInternalNode, useNodesData, Node, useReactFlow, applyNodeChanges, NodeChange } from '@xyflow/react';
import './skillNode.scss';
import NodeContent from '../nodeContent/NodeContent';

export type SkillNodeData = {
    label: string;
    description: string;
    state: State;
};

type State = "available" | "unlocked" | "locked" | "detached";

export function SkillNode({ id }: { id: string }): JSX.Element {
    const connection = useConnection();
    // TODO: useCallback for onUnlock
    const { data: { label, description, state: nodeState } } = useNodesData<Node<SkillNodeData>>(id);
    const reactFlow = useReactFlow<Node<SkillNodeData>>();

    const isTarget = connection.inProgress && connection.fromNode.id !== id;

    const onUnlock = () => {
        const nodes = reactFlow.getNodes();
        const edges = reactFlow.getEdges();

        const node = nodes.find((n) => n.id === id);
        if (!node) {
            return nodes;
        }

        const changes: NodeChange<Node<SkillNodeData>>[] = [{
            type: "replace", id,
            item: { ...node, data: { ...node.data, state: 'unlocked' } }
        }];

        const dependenIds: string[] = [];
        edges.forEach((edge) => {
            if (edge.source === id) {
                dependenIds.push(edge.target);
            }
        });

        dependenIds.forEach((depId) => {
            const node = nodes.find((n) => n.id === depId);
            if (!node) {
                return;
            };
            changes.push({
                type: "replace", id: depId,
                item: {
                    ...node, data: {
                        ...node.data,
                        state: "available"
                    }
                }
            });
        });

        reactFlow.setNodes(applyNodeChanges(changes, nodes));
    };

    let className = 'skill-node';
    if (nodeState === 'unlocked') {
        className += ' skill-node-unlocked'
    } else if (nodeState === 'locked') {
        className += ' skill-node-locked'
    } else if (nodeState === 'detached') {
        className += ' skill-node-detached'
    } else if (nodeState === 'available') {
        className += ' skill-node-available'
    }

    return (
        <div className={`${className} racket-grid`}>
            <div className="skill-node-body">
                {!connection.inProgress && (
                    <Handle
                        className="node-handle"
                        position={Position.Right}
                        type="source"
                        id={`${id}-source`}
                    />
                )}
                {(!connection.inProgress || isTarget) && (
                    <Handle
                        type="target"
                        id={`${id}-target`}
                        position={Position.Left}
                        className="node-handle"
                        isConnectableStart={false} />
                )}
                <NodeContent skillName={label} description={description} />
                {nodeState === 'available' || nodeState === 'locked' ? <button type='button' className="unlock-skill-button" onClick={onUnlock}>Unlock</button> : null}
            </div>
            <span className="draggable-ball"></span>
        </div>
    );
}

