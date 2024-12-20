import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import PerformanceChart from '../../../components/PerformanceChart';
import { performanceMonitor } from '../../../utils/performance';
import { errorMonitor } from '../../../utils/error';
import { tracker } from '../../../utils/tracker';

interface ResourceData {
  name: string;
  duration: number;
  startTime: number;
  transferSize: number;
}

const PerformancePage: React.FC = () => {
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // 获取资源加载数据
    setResources(performanceMonitor.getResourceTimings());

    // 获取错误数据
    setErrors(errorMonitor.getErrors());

    // 获取用户行为数据
    setEvents(tracker.getEvents());

    // 定时更新数据
    const timer = setInterval(() => {
      setResources(performanceMonitor.getResourceTimings());
      setErrors(errorMonitor.getErrors());
      setEvents(tracker.getEvents());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        性能监控
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PerformanceChart />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              资源加载
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>资源名称</TableCell>
                    <TableCell align="right">加载时间 (ms)</TableCell>
                    <TableCell align="right">开始时间 (ms)</TableCell>
                    <TableCell align="right">大小 (bytes)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resources.map((resource, index) => (
                    <TableRow key={index}>
                      <TableCell>{resource.name}</TableCell>
                      <TableCell align="right">
                        {resource.duration.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {resource.startTime.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">{resource.transferSize}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              错误日志
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>类型</TableCell>
                    <TableCell>消息</TableCell>
                    <TableCell>时间</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errors.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{error.type}</TableCell>
                      <TableCell>{error.message}</TableCell>
                      <TableCell>
                        {new Date(error.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              用户行为
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>类型</TableCell>
                    <TableCell>标签</TableCell>
                    <TableCell>时间</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.label}</TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformancePage; 