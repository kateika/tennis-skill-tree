import React from 'react';
import { Handle, Position, useConnection, useNodesData, Node, useReactFlow, applyNodeChanges, NodeChange } from '@xyflow/react';
import './skillNode.scss';
import NodeContent from '../nodeContent/NodeContent';
import classNames from "classNames";

export type SkillNodeData = {
    label: string;
    description: string;
    state: State;
};

type State = "available" | "unlocked" | "locked" | "detached";

export function SkillNode({ id }: { id: string }): JSX.Element {
    const connection = useConnection();
    // todo: useCallback for onUnlock?
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

        // todo: replace with getOutgoers
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
                        state: node.data.state === "unlocked" ? "unlocked" : "available"
                    }
                }
            });
        });

        reactFlow.setNodes(applyNodeChanges(changes, nodes));
    };

    return (
        <div className={classNames("racket-grid", "skill-node", {
            "skill-node-unlocked": nodeState === "unlocked",
            "skill-node-locked": nodeState === "locked",
            "skill-node-detached": nodeState === "detached",
            "skill-node-available": nodeState === "available"
        })}>
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
                        className={classNames("node-handle", { "node-handle-invalid": !connection.isValid && id === connection.toNode?.id })}
                        isConnectableStart={false} />
                )}
                <NodeContent skillName={label} description={description} />
                {nodeState === 'available' || nodeState === 'locked' ? <button type='button' className="unlock-skill-button" onClick={onUnlock}>Unlock</button> : null}
            </div>
            <span className="draggable-ball"></span>
        </div>
    );
}

