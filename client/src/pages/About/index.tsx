import { CardMedia } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { request } from '../../utils/request';
import Loading from '../../components/Loading';
import { Container, Typography, Card, CardContent, Grid, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/material';
import { styled } from '@mui/material/styles';

interface About {
  title: string;
  description: string;
  image: string;
  history: {
    year: number;
    title: string;
    description: string;
  }[];
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledImage = styled(CardMedia)(({ theme }) => ({
  height: 400,
  [theme.breakpoints.down('sm')]: {
    height: 200,
  },
}));

const AboutPage = () => {
  const { data: about, isLoading } = useQuery<About>({
    queryKey: ['about'],
    queryFn: () => request.get('/about').then(res => res.data),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!about) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <StyledCard elevation={3}>
        <StyledImage
          component="img"
          image={about.image}
          alt={about.title}
        />
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {about.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {about.description}
          </Typography>
        </CardContent>
      </StyledCard>

      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 6, mb: 4 }}>
        发展历程
      </Typography>

      <Timeline position="alternate">
        {about.history.map((item, index) => (
          <TimelineItem key={item.year}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < about.history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3">
                    {item.year}年
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
};

export default AboutPage; 