import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../hooks/useToast';

interface AddressFormProps {
  address?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    isDefault: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const AddressForm = ({ address, onSuccess, onCancel }: AddressFormProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  const createAddress = useMutation({
    mutationFn: (data: typeof formData) =>
      request.post('/addresses', data),
    onSuccess: () => {
      showToast('地址添加成功', 'success');
      onSuccess();
    },
    onError: () => {
      showToast('地址添加失败', 'error');
    },
  });

  const updateAddress = useMutation({
    mutationFn: (data: typeof formData) =>
      request.put(`/addresses/${address?.id}`, data),
    onSuccess: () => {
      showToast('地址更新成功', 'success');
      onSuccess();
    },
    onError: () => {
      showToast('地址更新失败', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      updateAddress.mutate(formData);
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {address ? '编辑地址' : '新增地址'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="收货人"
            value={formData.name}
            onChange={handleChange('name')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="手机号码"
            value={formData.phone}
            onChange={handleChange('phone')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="详细地址"
            value={formData.address}
            onChange={handleChange('address')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="城市"
            value={formData.city}
            onChange={handleChange('city')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="省份"
            value={formData.state}
            onChange={handleChange('state')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="邮政编码"
            value={formData.postcode}
            onChange={handleChange('postcode')}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDefault: e.target.checked,
                  })
                }
              />
            }
            label="设为默认地址"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          取消
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={createAddress.isLoading || updateAddress.isLoading}
        >
          {createAddress.isLoading || updateAddress.isLoading
            ? '保存中...'
            : '保存'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm; 