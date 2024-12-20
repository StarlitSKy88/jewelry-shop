import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useQuery, useMutation } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface ProfileForm {
  username: string;
  email: string;
  phone: string;
  address: string;
}

const Profile: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState<ProfileForm>({
    username: '',
    email: '',
    phone: '',
    address: '',
  });

  const { data: user, isLoading } = useQuery<ApiResponse<User>>({
    queryKey: ['user'],
    queryFn: () =>
      request.get<ApiResponse<User>>('/user/profile').then((res) => res.data),
    onSuccess: (data) => {
      setForm({
        username: data.data.username,
        email: data.data.email,
        phone: data.data.phone || '',
        address: data.data.address || '',
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => request.put('/user/profile', data),
    onSuccess: () => {
      showSuccess('个人资料已更新');
    },
    onError: () => {
      showError('更新个人资料失败');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email) {
      showError('请填写必填项');
      return;
    }
    updateProfileMutation.mutate(form);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        个人资料
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Avatar
              src={user.data.avatar}
              alt={user.data.username}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6">{user.data.username}</Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <TextField
              fullWidth
              label="用户名"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="手机号码"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="地址"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={updateProfileMutation.isPending}
            >
              保存修改
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile; 