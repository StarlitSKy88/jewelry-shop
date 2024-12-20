import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { LineChart, PieChart, BarChart } from '@mui/x-charts';

const Dashboard = () => {
  // 示例数据
  const visitData = [
    { time: '00:00', value: 3 },
    { time: '03:00', value: 2 },
    { time: '06:00', value: 6 },
    { time: '09:00', value: 12 },
    { time: '12:00', value: 15 },
    { time: '15:00', value: 20 },
    { time: '18:00', value: 18 },
    { time: '21:00', value: 10 },
  ];

  const salesData = [
    { category: '手链', value: 35 },
    { category: '项链', value: 25 },
    { category: '戒指', value: 20 },
    { category: '耳饰', value: 15 },
    { category: '其他', value: 5 },
  ];

  const performanceData = {
    labels: ['页面加载', '首次内容', 'DOM加载', '资源加载'],
    datasets: [
      {
        data: [2.5, 1.8, 3.2, 4.5],
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        仪表盘
      </Typography>
      <Grid container spacing={3}>
        {/* 访问量统计 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              今日访问量
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <LineChart
                xAxis={[{ data: visitData.map(item => item.time) }]}
                series={[{ data: visitData.map(item => item.value) }]}
                height={200}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 销售分布 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              销售分布
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <PieChart
                series={[
                  {
                    data: salesData.map(item => ({
                      id: item.category,
                      value: item.value,
                      label: item.category,
                    })),
                  },
                ]}
                height={200}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 性能指标 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              性能指标 (秒)
            </Typography>
            <Box sx={{ height: 300 }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: performanceData.labels }]}
                series={[{ data: performanceData.datasets[0].data }]}
                height={250}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 