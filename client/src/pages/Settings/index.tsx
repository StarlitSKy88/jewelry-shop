import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { useQuery, useMutation } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const Settings: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    pushNotifications: true,
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { data, isLoading } = useQuery<ApiResponse<Settings>>({
    queryKey: ['settings'],
    queryFn: () =>
      request.get<ApiResponse<Settings>>('/user/settings').then((res) => res.data),
    onSuccess: (data) => {
      setSettings({
        emailNotifications: data.data.emailNotifications,
        pushNotifications: data.data.pushNotifications,
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Settings) => request.put('/user/settings', data),
    onSuccess: () => {
      showSuccess('设置已更新');
    },
    onError: () => {
      showError('更新设置失败');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: {
      oldPassword: string;
      newPassword: string;
    }) => request.put('/user/password', data),
    onSuccess: () => {
      showSuccess('密码已更新');
      setPasswords({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: () => {
      showError('更新密码失败');
    },
  });

  const handleSettingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = event.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showError('两次输入的密码不一致');
      return;
    }
    changePasswordMutation.mutate({
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        设置
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            通知设置
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSettingChange}
                  name="emailNotifications"
                />
              }
              label="邮件通知"
            />
            <Typography variant="body2" color="text.secondary">
              接收订单状态更新、促销活动等邮件通知
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleSettingChange}
                  name="pushNotifications"
                />
              }
              label="推送通知"
            />
            <Typography variant="body2" color="text.secondary">
              接收实时订单状态更新和系统通知
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending}
          >
            保存设置
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            修改密码
          </Typography>
          <Box
            component="form"
            onSubmit={handleChangePassword}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: 400,
            }}
          >
            <TextField
              fullWidth
              type="password"
              label="当前密码"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="新密码"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="确认新密码"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={changePasswordMutation.isPending}
            >
              修改密码
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Settings; 