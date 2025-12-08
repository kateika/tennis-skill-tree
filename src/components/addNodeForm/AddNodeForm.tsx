import { useNodes, useReactFlow, Node } from '@xyflow/react';
import './addNodeForm.scss';
import { SkillNodeData } from '../skillNode/SkillNode';

const AddNodeForm = (): JSX.Element => {
    const { addNodes } = useReactFlow();
    const nodes = useNodes();

    const nextCoordinateX = nodes[nodes.length - 1]?.position.x || 0;
    const nextCoordinateY = nodes[nodes.length - 1]?.position.y + 80 || 0;

    /*@ts-ignore */
    const addNode = (e) => {
        e.preventDefault();
        const label = e.target[0].value;
        const description = e.target[1].value;

        const node: Node<SkillNodeData> = {
            id: `n-${Date.now()}`,
            type: "custom",
            position: { x: nextCoordinateX, y: nextCoordinateY },
            data: { label, description, state: "detached" },
        };

        addNodes(node);
    }

    return (
        <form className="form-wrapper" onSubmit={addNode}>
            <input type="text" placeholder="skill-name" />
            <input type="text" placeholder="skill-description" />
            <button type="submit">Add Node</button>
        </form>
    )
};


export default AddNodeForm