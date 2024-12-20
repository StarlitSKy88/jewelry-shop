import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../hooks/useToast';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

interface AddressListProps {
  onEdit: (address: Address) => void;
  selectable?: boolean;
  onSelect?: (address: Address) => void;
  selectedId?: string;
}

const AddressList = ({
  onEdit,
  selectable,
  onSelect,
  selectedId,
}: AddressListProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => request.get<Address[]>('/addresses').then((res) => res.data),
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) => request.delete(`/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      showToast('地址删除成功', 'success');
    },
    onError: () => {
      showToast('地址删除失败', 'error');
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: (id: string) =>
      request.put(`/addresses/${id}/default`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      showToast('默认地址设置成功', 'success');
    },
    onError: () => {
      showToast('默认地址设置失败', 'error');
    },
  });

  if (isLoading) {
    return null;
  }

  if (!addresses?.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
        }}
      >
        <LocationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography color="text.secondary">暂无收货地址</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {addresses.map((address) => (
        <Grid item xs={12} key={address.id}>
          <Card
            sx={{
              cursor: selectable ? 'pointer' : 'default',
              border: selectedId === address.id ? 2 : 1,
              borderColor: selectedId === address.id ? 'primary.main' : 'divider',
            }}
            onClick={() => selectable && onSelect?.(address)}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {address.name}{' '}
                    <Typography
                      component="span"
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      {address.phone}
                    </Typography>
                  </Typography>
                  <Typography color="text.secondary">
                    {address.state} {address.city}
                  </Typography>
                  <Typography>{address.address}</Typography>
                  <Typography color="text.secondary">
                    {address.postcode}
                  </Typography>
                  {address.isDefault && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        border: 1,
                        borderColor: 'primary.main',
                        px: 1,
                        borderRadius: 1,
                        mt: 1,
                        display: 'inline-block',
                      }}
                    >
                      默认地址
                    </Typography>
                  )}
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(address);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress.mutate(address.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              {!address.isDefault && (
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefaultAddress.mutate(address.id);
                  }}
                  sx={{ mt: 1 }}
                >
                  设为默认
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AddressList; 