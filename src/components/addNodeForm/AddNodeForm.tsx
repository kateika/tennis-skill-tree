import { useContext } from 'react';
import './addNodeForm.scss';
import { FC, useState, FormEvent } from 'react';
import { AppContext } from '@components/state/context';

const AddNodeForm: FC = () => {
  const [hasFormError, setHasFormError] = useState(false);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  const { addNode } = useContext(AppContext);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    // fields validation
    if (!label) {
      setHasFormError(true);
      return;
    }

    addNode(label, description);

    // Reset the form inputs
    setLabel('');
    setDescription('');
    setHasFormError(false);
  };

  return (
    <form className="form-wrapper" onSubmit={onSubmit}>
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

      {hasFormError && (
        <p className="form-error" data-testid="skill-form-error">
          Please fill in a skill
        </p>
      )}
      <button type="submit" className="form-button">
        Add Node
      </button>
    </form>
  );
};

export default AddNodeForm;
