import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../components/Toast';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const { showSuccess } = useToast();
  const { values, handleChange, handleSubmit, resetForm } = useForm<ContactForm>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    onSubmit: async (values) => {
      // TODO: 实现发送消息的逻辑
      console.log('提交的表单数据:', values);
      showSuccess('消息已发送，我们会尽快回复您！');
      resetForm();
    },
  });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        联系我们
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph align="center">
        如果您有任何问题或建议，请随时与我们联系
      </Typography>

      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  地址
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  上海市浦东新区陆家嘴环路1000号
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PhoneIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  电话
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  400-123-4567
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  邮箱
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  contact@jewelryshop.com
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          发送消息
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="姓名"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="电话"
              name="phone"
              value={values.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="消息"
              name="message"
              multiline
              rows={4}
              value={values.message}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              发送消息
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Contact; 