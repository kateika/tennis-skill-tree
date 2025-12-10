import { createContext } from 'react';

type Context = {
  unlockNode: (id: string) => void;
  addNode: (label: string, description: string) => void;
};

const defaultContext: Context = {
  unlockNode: () => console.trace('unlockNode is not implemented'),
  addNode: () => console.trace('addNode is not implemented'),
};

export const AppContext = createContext(defaultContext);
