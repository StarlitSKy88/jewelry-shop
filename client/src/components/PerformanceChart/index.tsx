import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Tab, Tabs } from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { performanceMonitor } from '../../utils/performance';

interface ChartData {
  name: string;
  value: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PerformanceChart: React.FC = () => {
  const [webVitalsData, setWebVitalsData] = useState<ChartData[]>([]);
  const [resourceData, setResourceData] = useState<ChartData[]>([]);
  const [systemData, setSystemData] = useState<ChartData[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const updateData = () => {
      const metrics = performanceMonitor.getMetrics();
      
      // Web Vitals数据
      setWebVitalsData([
        { name: 'FCP', value: metrics.fcp },
        { name: 'LCP', value: metrics.lcp },
        { name: 'FID', value: metrics.fid },
        { name: 'CLS', value: metrics.cls * 1000 },
        { name: 'TTFB', value: metrics.ttfb },
      ]);

      // 系统性能数据
      setSystemData([
        { name: 'Memory Usage (%)', value: metrics.memoryUsage },
        { name: 'CPU Usage (%)', value: metrics.cpuUsage },
        { name: 'FPS', value: metrics.fps },
        { name: 'DOM Nodes', value: metrics.domNodes },
        { name: 'JS Heap (MB)', value: metrics.jsHeapSize / (1024 * 1024) },
      ]);

      // 资源性能数据
      const resources = performanceMonitor.getResourceTimings();
      setResourceData(
        resources.slice(0, 10).map((resource) => ({
          name: resource.name.split('/').pop() || '',
          value: resource.duration,
        }))
      );

      // 性能分析数据
      setAnalyticsData(performanceMonitor.getAnalytics());
    };

    updateData();
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderRecommendations = () => {
    if (!analyticsData?.recommendations) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          性能优化建议
        </Typography>
        {analyticsData.recommendations.map((recommendation: string, index: number) => (
          <Typography key={index} variant="body2" color="text.secondary" gutterBottom>
            • {recommendation}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderTrends = () => {
    if (!analyticsData?.trends) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          性能趋势
        </Typography>
        {Object.entries(analyticsData.trends).map(([metric, trend]: [string, string]) => (
          <Typography key={metric} variant="body2" color="text.secondary" gutterBottom>
            • {metric}: {trend}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        性能监控
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Web Vitals" />
        <Tab label="系统性能" />
        <Tab label="资源性能" />
        <Tab label="性能分析" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={webVitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#8884d8"
                name="毫秒"
                label={{ position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                name="数值"
                label={{ position: 'top' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#ffc658"
                name="加载时间(ms)"
                label={{ position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderRecommendations()}
          </Grid>
          <Grid item xs={12}>
            {renderTrends()}
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default PerformanceChart; 