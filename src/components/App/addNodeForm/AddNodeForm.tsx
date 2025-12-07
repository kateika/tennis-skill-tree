import { useReactFlow } from '@xyflow/react';
import './FormWrapper.scss';

//https://reactflow.dev/examples/nodes/add-node-on-edge-drop when we drop the edge we can see the form with text
const AddNodeForm = (): JSX.Element => {
    const {addNodes} = useReactFlow();

    /*@ts-ignore */
    const addNode = (e) => {
        e.preventDefault();
        addNodes([{id: `n-${Date.now()}`, type: "custom", position: { x: 50, y: 50 }, data: { label:e.target[0].value, description: e.target[1].value, level: e.target[2].value}}]);
    }

    // todo: clear input after submit
    // todo: all fields except "level" is optional
    // todo: style the form
    return (
        <form className="form-wrapper" onSubmit={addNode}>
            <input type="text" placeholder="skill-name" />
            <input type="text" placeholder="skill-description" />
            <input type="text" placeholder="skill-level" />
            <button type="submit">Add Node</button>
        </form>
    )
};


export default AddNodeForm