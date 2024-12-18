import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, loading, error, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccess(false);

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setValidationError('两次��入的新密码不一致');
        return;
      }
      if (!formData.password) {
        setValidationError('请输入当前密码');
        return;
      }
    }

    const updateData = {
      name: formData.name,
      ...(formData.newPassword && {
        currentPassword: formData.password,
        newPassword: formData.newPassword,
      }),
    };

    try {
      await updateProfile(updateData);
      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            src={user?.avatar}
            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            个人资料
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            资料更新成功
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="姓名"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="邮箱"
                name="email"
                value={formData.email}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Divider>修改密码（选填）</Divider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="当前密码"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="新密码"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="确认新密码"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '保存修改'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 