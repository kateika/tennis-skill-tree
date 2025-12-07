import { Handle, Position, useConnection, useNodesData } from '@xyflow/react';
import './skillNode.scss';

export default function SkillNode({ id }: { id: string }): JSX.Element {
    const connection = useConnection();
    const { data } = useNodesData(id);
    // todo kate: level is optional and this label have to be changed accordingly
    const skillLabel = data ? `${data.label} \/n ${data.description} \/n Level: ${data.level}` : 'Drag to connect';

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  /*@ts-ignore */
  const label = isTarget ? 'Drop here' : skillLabel;

  return (
    <div className="skill-node">
      <div className="skill-node-body">
        {!connection.inProgress && (
          <Handle
            className="node-handle"
            position={Position.Right}
            type="source"
          />
        )}
        {(!connection.inProgress || isTarget) && (
          <Handle type="target" position={Position.Left} className="node-handle" isConnectableStart={false} />
        )}
        {label}
      </div>
    </div>
  );
}