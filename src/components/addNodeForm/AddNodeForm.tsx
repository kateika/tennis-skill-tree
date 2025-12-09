import { SkillNodeData } from '@components/skillNode/SkillNode';
import './addNodeForm.scss';
import { FC, useState, FormEvent } from 'react';
import { useReactFlow, Node } from '@xyflow/react';
import { POSITION_SHIFT } from '@components/App/constants';

const AddNodeForm: FC = () => {
    const [hasFormError, setHasFormError] = useState(false);
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const { getNodes, addNodes } = useReactFlow<Node<SkillNodeData>>();

    const addNode = (e: FormEvent) => {
        e.preventDefault();

        // fields validation
        if (!label) {
            setHasFormError(true);
            return;
        }

        // getting coordinates for the new node
        const nodes = getNodes();
        const lastNode = nodes[nodes.length - 1];
        const nextCoordinateX = (lastNode?.position.x ?? 0) + POSITION_SHIFT.x;
        const nextCoordinateY = (lastNode?.position.y ?? 0) + POSITION_SHIFT.y;

        // create and add a new node
        const node: Node<SkillNodeData> = {
            id: `n-${Date.now()}`,
            type: 'custom',
            position: { x: nextCoordinateX, y: nextCoordinateY },
            data: { label, description, state: 'detached' },
        };

        addNodes(node);

        // Reset the form inputs
        setLabel('');
        setDescription('');
        setHasFormError(false);
    };

    return (
        <form className="form-wrapper" onSubmit={addNode}>
            <div className="input-wrapper">
                <input
                    type="text"
                    name="skill-name"
                    placeholder="Skill"
                    className="form-input form-skill-name"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <span className="focus-border">
                    <i></i>
                </span>
            </div>

            <div className="input-wrapper">
                <input
                    type="text"
                    name="skill-description"
                    placeholder="Description"
                    className="form-input form-skill-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <span className="focus-border">
                    <i></i>
                </span>
            </div>

            {hasFormError && <p className="form-error">Please fill in all fields</p>}
            <button type="submit" className="form-button">Add Node</button>
        </form>
    );
};

export default AddNodeForm;