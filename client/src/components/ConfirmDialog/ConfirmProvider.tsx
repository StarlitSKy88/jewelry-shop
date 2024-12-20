import React, { createContext, useContext } from 'react';
import useConfirm from '../../hooks/useConfirm';
import ConfirmDialog from './index';

interface ConfirmContextType {
  confirm: (options: {
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
  }) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirmDialog = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmProvider');
  }
  return context;
};

interface ConfirmProviderProps {
  children: React.ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const confirmDialog = useConfirm();

  return (
    <ConfirmContext.Provider value={{ confirm: confirmDialog.confirm }}>
      {children}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        content={confirmDialog.content}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    </ConfirmContext.Provider>
  );
}; 