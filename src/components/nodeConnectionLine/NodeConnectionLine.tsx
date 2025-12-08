import { getStraightPath } from '@xyflow/react';

/*@ts-ignore */
const NodeConnectionLine = ({ fromX, fromY, toX, toY, connectionLineStyle }) => {
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