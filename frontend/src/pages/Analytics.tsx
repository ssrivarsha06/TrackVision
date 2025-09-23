import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, Train, Download, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('delays');

  const kpiData = {
    '7d': {
      avg_delay: '12.5 min',
      on_time_performance: '78.2%',
      total_trains: '168',
      throughput: '24.0 trains/hr',
      section_utilization: '89.3%',
      incident_count: '3',
      cost_efficiency: '₹5.2L saved',
      passenger_satisfaction: '4.2/5'
    },
    '30d': {
      avg_delay: '15.8 min',
      on_time_performance: '75.6%',
      total_trains: '720',
      throughput: '23.2 trains/hr',
      section_utilization: '86.7%',
      incident_count: '14',
      cost_efficiency: '₹18.6L saved',
      passenger_satisfaction: '4.0/5'
    },
    '90d': {
      avg_delay: '18.2 min',
      on_time_performance: '72.4%',
      total_trains: '2160',
      throughput: '22.8 trains/hr',
      section_utilization: '84.1%',
      incident_count: '45',
      cost_efficiency: '₹52.3L saved',
      passenger_satisfaction: '3.8/5'
    }
  };

  const dailyStats = [
    { date: '2024-01-09', trains: 24, avg_delay: 8, incidents: 0, efficiency: 92 },
    { date: '2024-01-10', trains: 26, avg_delay: 12, incidents: 1, efficiency: 88 },
    { date: '2024-01-11', trains: 23, avg_delay: 15, incidents: 2, efficiency: 82 },
    { date: '2024-01-12', trains: 25, avg_delay: 18, incidents: 1, efficiency: 79 },
    { date: '2024-01-13', trains: 28, avg_delay: 10, incidents: 0, efficiency: 91 },
    { date: '2024-01-14', trains: 22, avg_delay: 22, incidents: 3, efficiency: 71 },
    { date: '2024-01-15', trains: 20, avg_delay: 5, incidents: 0, efficiency: 95 }
  ];

  const trainPerformance = [
    { train: '12615', route: 'New Delhi - Chennai', on_time: 85, avg_delay: 8, reliability: 'High' },
    { train: '12951', route: 'New Delhi - Mumbai', on_time: 72, avg_delay: 18, reliability: 'Medium' },
    { train: '22691', route: 'New Delhi - Bangalore', on_time: 78, avg_delay: 12, reliability: 'High' },
    { train: '12002', route: 'New Delhi - Bhopal', on_time: 91, avg_delay: 4, reliability: 'High' },
    { train: '12801', route: 'New Delhi - Hyderabad', on_time: 68, avg_delay: 22, reliability: 'Low' }
  ];

  const currentData = kpiData[timeRange as keyof typeof kpiData];

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'High': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const exportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report for ${timeRange} period...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report exported successfully in ${format.toUpperCase()} format.`,
      });
    }, 2000);
  };

  const handleFilter = () => {
    toast({
      title: "Filter Options",
      description: "Opening advanced filter dialog...",
    });
  };

  return (
    <Layout activeSection="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground mt-1">
              Performance metrics, KPIs, and operational insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' }
          ].map((range) => (
            <Button
              key={range.id}
              variant={timeRange === range.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.id)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {range.label}
            </Button>
          ))}
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Delay</p>
                  <p className="text-2xl font-bold text-foreground">{currentData.avg_delay}</p>
                  <p className="text-xs text-success mt-1">↓ 8% from previous period</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On-Time Performance</p>
                  <p className="text-2xl font-bold text-foreground">{currentData.on_time_performance}</p>
                  <p className="text-xs text-success mt-1">↑ 12% from previous period</p>
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Trains</p>
                  <p className="text-2xl font-bold text-foreground">{currentData.total_trains}</p>
                  <p className="text-xs text-muted-foreground mt-1">{currentData.throughput}</p>
                </div>
                <Train className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Section Utilization</p>
                  <p className="text-2xl font-bold text-foreground">{currentData.section_utilization}</p>
                  <p className="text-xs text-success mt-1">↑ 5% from previous period</p>
                </div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyStats.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-primary rounded"></div>
                      <div>
                        <p className="font-medium text-foreground">{day.date}</p>
                        <p className="text-sm text-muted-foreground">{day.trains} trains</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Delay:</span>
                        <span className={`text-sm font-medium ${day.avg_delay > 15 ? 'text-destructive' : 'text-success'}`}>
                          {day.avg_delay}min
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Efficiency:</span>
                        <span className="text-sm font-medium text-foreground">{day.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Train Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Train Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainPerformance.map((train) => (
                  <div key={train.train} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-foreground">{train.train}</p>
                        <p className="text-sm text-muted-foreground">{train.route}</p>
                      </div>
                      <Badge className={getReliabilityColor(train.reliability)}>
                        {train.reliability}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">On-Time: </span>
                        <span className="font-medium text-foreground">{train.on_time}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Delay: </span>
                        <span className="font-medium text-foreground">{train.avg_delay} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{currentData.cost_efficiency}</p>
                <p className="text-sm text-muted-foreground mt-1">Total operational savings</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Efficiency:</span>
                    <span className="text-foreground">↑ 8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource Utilization:</span>
                    <span className="text-foreground">↑ 12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{currentData.incident_count}</p>
                <p className="text-sm text-muted-foreground mt-1">Total incidents</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signal Failures:</span>
                    <span className="text-foreground">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Track Issues:</span>
                    <span className="text-foreground">2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passenger Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{currentData.passenger_satisfaction}</p>
                <p className="text-sm text-muted-foreground mt-1">Average rating</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Punctuality:</span>
                    <span className="text-foreground">4.1/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Communication:</span>
                    <span className="text-foreground">4.3/5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => exportReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Performance Report (PDF)
              </Button>
              <Button variant="outline" onClick={() => exportReport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Data Export (Excel)
              </Button>
              <Button variant="outline" onClick={() => exportReport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Raw Data (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;