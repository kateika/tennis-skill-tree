import { Handle, Position, useConnection, useInternalNode, useNodesData, Node } from '@xyflow/react';
import './skillNode.scss';
import NodeContent from '../nodeContent/NodeContent';

export type SkillNodeData = {
    label: string;
    description: string;
    state: State;
};

type State = "available" | "completed" | "locked" | "detached";

export function SkillNode({ id }: { id: string }): JSX.Element {
    const connection = useConnection();
    const { data } = useNodesData<Node<SkillNodeData>>(id);

    const isTarget = connection.inProgress && connection.fromNode.id !== id;

    /*@ts-ignore */
    const label = isTarget ? <NodeContent skillName="TODO" description="DROP HERE" /> : <NodeContent skillName={data.label} description={data.description} />;

    let className = 'skill-node';
    if (data.state === 'completed') {
        className += ' skill-node-selected'
    } else if (data.state === 'locked') {
        className += ' skill-node-disabled'
    }

    return (
        <div className={`${className} racket-grid`}>
            <div className="skill-node-body">
                {!connection.inProgress && (
                    <>
                        <Handle
                            className="node-handle"
                            position={Position.Right}
                            type="source"
                        />
                    </>
                )}
                {(!connection.inProgress || isTarget) && (
                    <Handle type="target" position={Position.Left} className="node-handle" isConnectableStart={false} />
                )}
                {label}
                {data.state === 'available' && <button type='button' className='unlock-skill-button'>Unlock</button>}
            </div>
            <span className="draggable-ball"></span>
        </div>
    );
}

