import { useSnackbar, VariantType } from 'notistack';

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      autoHideDuration: 3000,
    });
  };

  return { showToast };
}; 