import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmDialogState extends ConfirmOptions {
  open: boolean;
  resolve: ((value: boolean) => void) | null;
}

const defaultState: ConfirmDialogState = {
  open: false,
  title: '',
  content: '',
  confirmText: '确认',
  cancelText: '取消',
  resolve: null,
};

export const useConfirm = () => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>(defaultState);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> =>
      new Promise((resolve) => {
        setDialogState({
          ...defaultState,
          ...options,
          open: true,
          resolve,
        });
      }),
    []
  );

  const handleClose = useCallback(
    (value: boolean) => {
      setDialogState(defaultState);
      dialogState.resolve?.(value);
    },
    [dialogState]
  );

  const handleConfirm = useCallback(() => handleClose(true), [handleClose]);
  const handleCancel = useCallback(() => handleClose(false), [handleClose]);

  return {
    ...dialogState,
    confirm,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };
};

export default useConfirm; 