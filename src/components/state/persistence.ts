import { defaultState } from './defaults';
import { State } from './state';

export const loadState = (): State => {
  let state = defaultState;
  try {
    state = JSON.parse(localStorage.getItem('skill-builder')) || defaultState;
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  } finally {
    return state;
  }
};

export const saveState = (state: State) => {
  localStorage.setItem('skill-builder', JSON.stringify(state));
};
