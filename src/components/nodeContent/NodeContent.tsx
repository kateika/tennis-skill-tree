import React from 'react';
import './nodeContent.scss';

const NodeContent = ({ skillName, description }: { skillName: string; description: string }) => {
  return (
    <article className="node-content">
      {skillName ? <span className="skill-name">{skillName}</span> : null}
      {description ? <p className="skill-description">{description}</p> : null}
    </article>
  );
};

export default NodeContent;
