import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ContactSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  backgroundColor: theme.palette.background.default,
}));

const ContactForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
}));

const Contact = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 处理表单提交
  };

  return (
    <ContactSection>
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" gutterBottom textAlign="center">
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph textAlign="center">
              We'd love to hear from you. Please fill out this form and we will get in touch with you shortly.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
            <ContactForm elevation={0}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </ContactForm>
          </Grid>
        </Grid>
      </Container>
    </ContactSection>
  );
};

export default Contact; 