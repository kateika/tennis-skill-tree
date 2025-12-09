import { ConnectionLineComponentProps, getStraightPath } from '@xyflow/react';

const NodeConnectionLine = ({ fromX, fromY, toX, toY, connectionLineStyle }: ConnectionLineComponentProps) => {
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