import { fireEvent, render, screen } from '@testing-library/react';
import { AppContext } from '@components/state';
import AddNodeForm from '@components/addNodeForm/AddNodeForm';

const getNameInput = () => screen.getByPlaceholderText<HTMLInputElement>('Skill');
const getDescriptionInput = () => screen.getByPlaceholderText<HTMLInputElement>('Description');
const getSubmitButton = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Add Node' });
const getFormError = () => screen.queryByTestId('skill-form-error');

describe('AddNodeForm', () => {
  const addNodeMock = jest.fn();

  beforeEach(() => {
    render(
      <AppContext.Provider value={{ addNode: addNodeMock, unlockNode: jest.fn() }}>
        <AddNodeForm />
      </AppContext.Provider>,
    );
  });

  describe('Happy scenarios', () => {
    it('should render the form with two inputs and a button', () => {
      expect(getNameInput()).toBeTruthy();
      expect(getDescriptionInput()).toBeTruthy();
      expect(getSubmitButton()).toBeTruthy();
    });

    it('should change fields value when user typing', () => {
      const nameInput = getNameInput();
      const descriptionInput = getDescriptionInput();

      fireEvent.change(nameInput, { target: { value: 'ahgagytiosh' } });
      fireEvent.change(descriptionInput, { target: { value: 'wtnsohshty' } });

      expect(nameInput.value).toBe('ahgagytiosh');
      expect(descriptionInput.value).toBe('wtnsohshty');
    });

    it('should call addNode function', () => {
      const nameInput = getNameInput();
      const descriptionInput = getDescriptionInput();
      const submitButton = getSubmitButton();

      fireEvent.change(nameInput, { target: { value: 'ahgagytiosh' } });
      fireEvent.change(descriptionInput, { target: { value: 'wtnsohshty' } });
      fireEvent.submit(submitButton);

      expect(getFormError()).toBeFalsy();
      expect(addNodeMock).toHaveBeenCalledTimes(1);
    });

    it('should clear the fields once form is submitted', () => {
      const nameInput = getNameInput();
      const descriptionInput = getDescriptionInput();
      const submitButton = getSubmitButton();

      // filling out and submitting form
      fireEvent.change(nameInput, { target: { value: 'ahgagytiosh' } });
      fireEvent.change(descriptionInput, { target: { value: 'wtnsohshty' } });
      fireEvent.submit(submitButton);

      expect(nameInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  describe('Error scenarios', () => {
    it('should show an error when skill name is empty', () => {
      const submitButton = getSubmitButton();
      fireEvent.submit(submitButton);

      expect(getFormError()).toBeTruthy();
    });

    it('should not clear the fields when a validation error occurred', () => {
      const descriptionInput = getDescriptionInput();
      const submitButton = getSubmitButton();

      fireEvent.change(descriptionInput, { target: { value: 'wtnsohshty' } });
      fireEvent.submit(submitButton);

      expect(descriptionInput.value).toBe('wtnsohshty');
    });
  });
});
