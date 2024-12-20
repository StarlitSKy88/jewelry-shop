import { saveAs } from 'file-saver';
import { monitoringAggregator } from './monitoringAggregator';
import { format } from 'date-fns';

interface ExportOptions {
  startTime?: number;
  endTime?: number;
  format: 'csv' | 'json' | 'excel';
  types: ('performance' | 'userBehavior' | 'errors')[];
}

class DataExportService {
  // 导出数据
  async exportData(options: ExportOptions): Promise<void> {
    const data = this.collectData(options);
    const fileName = this.generateFileName(options);

    switch (options.format) {
      case 'csv':
        await this.exportCSV(data, fileName);
        break;
      case 'json':
        await this.exportJSON(data, fileName);
        break;
      case 'excel':
        await this.exportExcel(data, fileName);
        break;
    }
  }

  // 收集数据
  private collectData(options: ExportOptions) {
    const data: Record<string, any> = {};
    const monitoringData = monitoringAggregator.getData(options.startTime, options.endTime);

    if (options.types.includes('performance')) {
      data.performance = monitoringAggregator.getPerformanceAnalysis();
    }
    if (options.types.includes('userBehavior')) {
      data.userBehavior = monitoringAggregator.getUserBehaviorAnalysis();
    }
    if (options.types.includes('errors')) {
      data.errors = monitoringAggregator.getErrorAnalysis();
    }

    return data;
  }

  // 生成文件名
  private generateFileName(options: ExportOptions): string {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const types = options.types.join('-');
    return `monitoring_${types}_${timestamp}.${options.format}`;
  }

  // 导出为CSV
  private async exportCSV(data: Record<string, any>, fileName: string) {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
  }

  // 导出为JSON
  private async exportJSON(data: Record<string, any>, fileName: string) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, fileName);
  }

  // 导出为Excel
  private async exportExcel(data: Record<string, any>, fileName: string) {
    // 这里需要引入额外的库来处理Excel导出
    // 例如：xlsx, exceljs等
    throw new Error('Excel export not implemented yet');
  }

  // 将数据转换为CSV格式
  private convertToCSV(data: Record<string, any>): string {
    const rows: string[] = [];

    // 处理性能数据
    if (data.performance) {
      rows.push('Performance Metrics');
      rows.push('Metric,Average,Min,Max');
      Object.entries(data.performance.metrics).forEach(([metric, values]: [string, any]) => {
        rows.push(`${metric},${values.avg},${values.min},${values.max}`);
      });
      rows.push('');

      rows.push('Performance Issues');
      data.performance.issues.forEach((issue: string) => {
        rows.push(issue);
      });
      rows.push('');
    }

    // 处理用户行为数据
    if (data.userBehavior) {
      rows.push('User Behavior Overview');
      rows.push('Metric,Value');
      Object.entries(data.userBehavior.overview).forEach(([metric, value]) => {
        rows.push(`${metric},${value}`);
      });
      rows.push('');

      rows.push('Top Actions');
      rows.push('Action,Count');
      data.userBehavior.topActions.forEach((action: any) => {
        rows.push(`${action.type},${action.count}`);
      });
      rows.push('');
    }

    // 处理错误数据
    if (data.errors) {
      rows.push('Error Overview');
      rows.push('Metric,Value');
      Object.entries(data.errors.overview).forEach(([metric, value]) => {
        rows.push(`${metric},${value}`);
      });
      rows.push('');

      rows.push('Top Errors');
      rows.push('Message,Count,Last Occurred');
      data.errors.topErrors.forEach((error: any) => {
        rows.push(`"${error.message}",${error.count},${new Date(error.lastOccurred).toISOString()}`);
      });
    }

    return rows.join('\n');
  }

  // 下载文件
  private download(content: string, fileName: string, type: string) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const dataExportService = new DataExportService(); 