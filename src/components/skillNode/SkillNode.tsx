import React, { useContext } from 'react';
import { Handle, Position, useConnection, useNodesData, Node, useReactFlow, applyNodeChanges, NodeChange } from '@xyflow/react';
import './skillNode.scss';
import NodeContent from '../nodeContent/NodeContent';
import classNames from "classNames";
import { SkillTreeContext } from '@components/state/context';

export type SkillNodeData = {
    label: string;
    description: string;
    state: State;
};

type State = "available" | "unlocked" | "locked" | "detached";

const SkillNode = ({ id }: { id: string }): JSX.Element => {
    const { unlockNode } = useContext(SkillTreeContext);
    const connection = useConnection();
    // todo: useCallback for onUnlock?
    const { data: { label, description, state: nodeState } } = useNodesData<Node<SkillNodeData>>(id);

    // checking that it's not the node we started from
    const isTarget = connection.inProgress && connection.fromNode.id !== id;

    const onUnlock = () => {
      unlockNode(id);
    };

    // TODO: replace with `skill-node-${nodeState}` for brevity
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

export default SkillNode;