import { SkillNodeData } from '@components/skillNode/SkillNode';
import './addNodeForm.scss';
import { FC, useState, useRef } from 'react';
import { useReactFlow, Node } from '@xyflow/react';
import { POSITION_SHIFT } from '@components/App/constants';

// type Props = {
//     onAddNode: (label: string, description: string) => void;
// };

const AddNodeForm: FC = () => {
    const [hasFormError, setHasFormError] = useState(false);
    const { getNodes, addNodes } = useReactFlow<Node<SkillNodeData>>();

    const formRef = useRef(null);

    /*@ts-ignore */
    const addNode = (e) => {
        e.preventDefault();

        // fields validation
        const label = e.target[0].value;
        const description = e.target[1].value;

        if (!label || !description) {
            setHasFormError(true)
            return;
        }

        // getting coordinates for the new node
        const nodes = getNodes();
        const nextCoordinateX = nodes[nodes.length - 1]?.position.x + POSITION_SHIFT.x || 0;
        const nextCoordinateY = nodes[nodes.length - 1]?.position.y + POSITION_SHIFT.y || 0;

        // create and add a new node
        const node: Node<SkillNodeData> = {
            id: `n-${Date.now()}`,
            type: "custom",
            position: { x: nextCoordinateX, y: nextCoordinateY },
            data: { label, description, state: "detached" },
        };

        addNodes(node);

        // Reset the form inputs
        if (formRef.current) {
            formRef.current.reset();
            setHasFormError(false);
        }
    }

    return (
        <form className="form-wrapper" onSubmit={addNode} ref={formRef}>
            <div className="input-wrapper">
                <input type="text" name="skill-name" placeholder="Skill" className="form-input form-skill-name" />
                <span className="focus-border">
                    <i></i>
                </span>
            </div>
            <div className="input-wrapper">
                <input type="text" name="skill-description" placeholder="Description" className="form-input form-skill-description" />

                <span className="focus-border">
                    <i></i>
                </span>
            </div>
            {hasFormError && <p className="form-error">Please fill in all fields</p>}
            <button type="submit" className="form-button">Add Node</button>
        </form>
    )
};


export default AddNodeForm