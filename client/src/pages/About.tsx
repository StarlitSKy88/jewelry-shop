import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const AboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  backgroundColor: theme.palette.background.default,
}));

const About = () => {
  return (
    <AboutSection>
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" gutterBottom textAlign="center">
              About Aurum Brothers
            </Typography>
            <Typography variant="body1" paragraph>
              Since 2015, Aurum Brothers has been crafting exceptional beaded bracelets that combine timeless elegance with contemporary style. Our journey began with a simple vision: to create unique, high-quality jewelry that tells a story and connects with its wearer on a personal level.
            </Typography>
            <Typography variant="body1" paragraph>
              Each piece in our collection is carefully handcrafted using only the finest materials, from precious stones to premium metals. We take pride in our attention to detail and commitment to quality, ensuring that every bracelet that bears the Aurum Brothers name meets our exacting standards.
            </Typography>
            <Typography variant="body1" paragraph>
              Our designs are inspired by historical, cultural, and mythical themes, creating pieces that are not just accessories, but meaningful symbols that resonate with our customers' personal journeys and aspirations.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </AboutSection>
  );
};

export default About; 