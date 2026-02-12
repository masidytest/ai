// CloudMonitoringService: Provides mocked metrics for servers

export interface CloudMetrics {
  cpu: number; // %
  ram: number; // MB
  disk: number; // GB
  netIn: number; // MBps
  netOut: number; // MBps
  timestamp: number;
}

export class CloudMonitoringService {
  private metrics: Record<string, CloudMetrics[]> = {};

  // Generate a single random metric sample
  private generateMetrics(): CloudMetrics {
    return {
      cpu: +(Math.random() * 80 + 10).toFixed(1),
      ram: +(Math.random() * 4096 + 1024).toFixed(0),
      disk: +(Math.random() * 80 + 20).toFixed(1),
      netIn: +(Math.random() * 10).toFixed(2),
      netOut: +(Math.random() * 10).toFixed(2),
      timestamp: Date.now(),
    };
  }

  // Get latest metrics for a server (simulate polling)
  async getMetrics(serverId: string, pollIntervalSec = 5): Promise<CloudMetrics> {
    if (!this.metrics[serverId]) {
      this.metrics[serverId] = [];
    }
    // Generate new metric if last is too old or missing
    const last = this.metrics[serverId][this.metrics[serverId].length - 1];
    if (!last || Date.now() - last.timestamp > pollIntervalSec * 1000) {
      const newMetric = this.generateMetrics();
      this.metrics[serverId].push(newMetric);
      return newMetric;
    }
    return last;
  }

  // Get metric history (for charts)
  async getMetricHistory(serverId: string, count = 20): Promise<CloudMetrics[]> {
    if (!this.metrics[serverId]) {
      this.metrics[serverId] = [];
    }
    // Fill with random data if not enough
    while (this.metrics[serverId].length < count) {
      this.metrics[serverId].push(this.generateMetrics());
    }
    return this.metrics[serverId].slice(-count);
  }
}
