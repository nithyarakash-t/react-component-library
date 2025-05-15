import { createContext, useContext } from 'react';

export interface ModalContextType {
  modalId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDialog: () => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Redundant - Custom hook to use modal context
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a Modal component');
  }
  return context;
}