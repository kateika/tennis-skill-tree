import { getStraightPath } from '@xyflow/react';

// https://reactflow.dev/examples/nodes/connection-limit
/*@ts-ignore */
function NodeConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });
 
  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
    </g>
  );
}
 
export default NodeConnectionLine;