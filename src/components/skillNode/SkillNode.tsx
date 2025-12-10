import React, { FC, useContext } from 'react';
import { Handle, Position, useConnection, useNodesData } from '@xyflow/react';
import './skillNode.scss';
import NodeContent from '../nodeContent/NodeContent';
import classNames from 'classNames';
import { AppContext, SkillNode } from '@components/state';

type Props = {
  id: string;
};

const SkillNode: FC<Props> = ({ id }) => {
  const { unlockNode } = useContext(AppContext);
  const connection = useConnection();
  const node = useNodesData<SkillNode>(id);

  const { label, description, state } = node.data;

  // checking that it's not the node we started from
  const isPotentialTarget = connection.inProgress && connection.fromNode.id !== id;
  const isInvalidTarget = !connection.isValid && id === connection.toNode?.id;
  const showUnlockBtn = state === 'available' || state === 'locked';

  const onUnlock = () => unlockNode(id);

  return (
    <div className={`racket-grid skill-node skill-node-${state}`}>
      <div className="skill-node-body">
        {!connection.inProgress && (
          <Handle className="node-handle" position={Position.Right} type="source" id={`${id}-source`} />
        )}
        {(!connection.inProgress || isPotentialTarget) && (
          <Handle
            type="target"
            id={`${id}-target`}
            position={Position.Left}
            className={classNames('node-handle', { 'node-handle-invalid': isInvalidTarget })}
            isConnectableStart={false}
          />
        )}
        <NodeContent skillName={label} description={description} />
        {showUnlockBtn && (
          <button type="button" className="unlock-skill-button" onClick={onUnlock}>
            Unlock
          </button>
        )}
      </div>
      <span className="draggable-ball"></span>
    </div>
  );
};

export default SkillNode;
