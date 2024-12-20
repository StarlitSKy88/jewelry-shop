import React, { useEffect, useState } from 'react';
import { monitoringAggregator } from '../../services/monitoringAggregator';
import { Card, Tabs, DatePicker, Space, Statistic, Table, Alert } from 'antd';
import { LineChart, PieChart } from '../Analytics/charts';
import type { Moment } from 'moment';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export const MonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [userBehaviorData, setUserBehaviorData] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);

  useEffect(() => {
    // 启动监控
    monitoringAggregator.start();

    // 初始加载数据
    loadData();

    // 定期刷新数据
    const interval = setInterval(loadData, 60000); // 每分钟刷新

    return () => {
      clearInterval(interval);
      monitoringAggregator.stop();
    };
  }, []);

  const loadData = () => {
    const startTime = dateRange[0]?.valueOf();
    const endTime = dateRange[1]?.valueOf();

    setPerformanceData(monitoringAggregator.getPerformanceAnalysis());
    setUserBehaviorData(monitoringAggregator.getUserBehaviorAnalysis());
    setErrorData(monitoringAggregator.getErrorAnalysis());
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  return (
    <div className="monitoring-dashboard">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 时间范围选择器 */}
        <Card>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Moment | null, Moment | null])}
              showTime
            />
          </Space>
        </Card>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 性能监控 */}
          <TabPane tab="性能监控" key="performance">
            {performanceData?.issues.length > 0 && (
              <Alert
                type="warning"
                message="性能问题"
                description={
                  <ul>
                    {performanceData.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                }
                style={{ marginBottom: 16 }}
              />
            )}

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* 性能指标概览 */}
              <Card title="性能指标">
                <Space wrap>
                  {Object.entries(performanceData?.metrics || {}).map(([key, value]: [string, any]) => (
                    <Card key={key} size="small">
                      <Statistic
                        title={key}
                        value={value.avg}
                        precision={2}
                        suffix="ms"
                      />
                      <div className="metric-range">
                        范围: {value.min.toFixed(2)} - {value.max.toFixed(2)}ms
                      </div>
                    </Card>
                  ))}
                </Space>
              </Card>

              {/* 性能趋势图 */}
              <Card title="性能趋势">
                <LineChart
                  data={Object.entries(performanceData?.trends || {}).map(([key, values]: [string, number[]]) => ({
                    name: key,
                    data: values,
                  }))}
                />
              </Card>
            </Space>
          </TabPane>

          {/* 用户行为监控 */}
          <TabPane tab="用户行为" key="behavior">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* 用户行为概览 */}
              <Card title="用户行为概览">
                <Space wrap>
                  <Statistic
                    title="总访问量"
                    value={userBehaviorData?.overview.totalPageViews}
                  />
                  <Statistic
                    title="平均会话时长"
                    value={userBehaviorData?.overview.avgSessionDuration}
                    suffix="秒"
                  />
                  <Statistic
                    title="跳出率"
                    value={userBehaviorData?.overview.bounceRate}
                    suffix="%"
                  />
                </Space>
              </Card>

              {/* 用户行为分析 */}
              <Card title="用户行为分析">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* 热门行为 */}
                  <Card title="热门行为" size="small">
                    <PieChart
                      data={userBehaviorData?.topActions.map((action: any) => ({
                        name: action.type,
                        value: action.count,
                      }))}
                    />
                  </Card>

                  {/* 访问趋势 */}
                  <Card title="访问趋势" size="small">
                    <LineChart
                      data={[
                        {
                          name: '访问量',
                          data: userBehaviorData?.trends.pageViews || [],
                        },
                        {
                          name: '独立用户',
                          data: userBehaviorData?.trends.uniqueUsers || [],
                        },
                      ]}
                    />
                  </Card>
                </Space>
              </Card>
            </Space>
          </TabPane>

          {/* 错误监控 */}
          <TabPane tab="错误监控" key="errors">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* 错误概览 */}
              <Card title="错误概览">
                <Space wrap>
                  <Statistic
                    title="总错误数"
                    value={errorData?.overview.totalErrors}
                  />
                  <Statistic
                    title="唯一错误数"
                    value={errorData?.overview.uniqueErrors}
                  />
                </Space>
              </Card>

              {/* 错误列表 */}
              <Card title="错误详情">
                <Table
                  dataSource={errorData?.topErrors}
                  columns={[
                    {
                      title: '错误信息',
                      dataIndex: 'message',
                      key: 'message',
                    },
                    {
                      title: '出现次数',
                      dataIndex: 'count',
                      key: 'count',
                      sorter: (a: any, b: any) => a.count - b.count,
                    },
                    {
                      title: '最后出现时间',
                      dataIndex: 'lastOccurred',
                      key: 'lastOccurred',
                      render: (time: number) => new Date(time).toLocaleString(),
                    },
                  ]}
                />
              </Card>

              {/* 错误趋势 */}
              <Card title="错误趋势">
                <LineChart
                  data={[
                    {
                      name: '错误数',
                      data: errorData?.trends.errors || [],
                    },
                  ]}
                />
              </Card>
            </Space>
          </TabPane>
        </Tabs>
      </Space>
    </div>
  );
}; 