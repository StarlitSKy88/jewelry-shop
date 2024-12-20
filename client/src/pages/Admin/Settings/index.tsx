import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../utils/request';
import { useToast } from '../../../components/Toast';
import Loading from '../../../components/Loading';
import { useForm } from '../../../hooks/useForm';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  enableRegistration: boolean;
  enableGuestCheckout: boolean;
  maintenanceMode: boolean;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const AdminSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: settings, isLoading } = useQuery<ApiResponse<Settings>>({
    queryKey: ['admin-settings'],
    queryFn: () => request.get<ApiResponse<Settings>>('/admin/settings').then((res) => res.data),
  });

  const { values, handleChange, handleSubmit, setFieldValue } = useForm<Settings>({
    initialValues: settings?.data || {
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      enableRegistration: true,
      enableGuestCheckout: false,
      maintenanceMode: false,
    },
    onSubmit: async (values) => {
      await updateMutation.mutateAsync(values);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Settings) =>
      request.put<ApiResponse<Settings>>('/admin/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      showSuccess('设置已更新');
    },
    onError: () => {
      showError('更新设置失败');
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        系统设置
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本设置
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="网站名称"
                name="siteName"
                value={values.siteName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="网站描述"
                name="siteDescription"
                value={values.siteDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="联系邮箱"
                name="contactEmail"
                type="email"
                value={values.contactEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="联系电话"
                name="contactPhone"
                value={values.contactPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="地址"
                name="address"
                value={values.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                功能设置
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.enableRegistration}
                    onChange={(e) =>
                      setFieldValue('enableRegistration', e.target.checked)
                    }
                  />
                }
                label="允许用户注册"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.enableGuestCheckout}
                    onChange={(e) =>
                      setFieldValue('enableGuestCheckout', e.target.checked)
                    }
                  />
                }
                label="允许游客结账"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.maintenanceMode}
                    onChange={(e) =>
                      setFieldValue('maintenanceMode', e.target.checked)
                    }
                  />
                }
                label="维护模式"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={updateMutation.isLoading}
                >
                  保存设置
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminSettings; 