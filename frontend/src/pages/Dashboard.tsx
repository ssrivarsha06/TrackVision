import React from 'react';
import Layout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';
import TrainCard from '@/components/TrainCard';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Train, Clock, AlertCircle, TrendingUp, Users, Zap } from 'lucide-react';

const Dashboard = () => {
  // Mock data for the dashboard
  const metrics = [
    {
      title: 'Active Trains',
      value: '24',
      subtitle: '18 on-time, 6 delayed',
      icon: Train,
      trend: { value: 8, direction: 'up' as const, isPositive: true }
    },
    {
      title: 'Average Delay',
      value: '12 min',
      subtitle: 'Section A performance',
      icon: Clock,
      trend: { value: 15, direction: 'down' as const, isPositive: true }
    },
    {
      title: 'Active Alerts',
      value: '3',
      subtitle: '1 critical, 2 warnings',
      icon: AlertCircle,
      trend: { value: 2, direction: 'down' as const, isPositive: true }
    },
    {
      title: 'Throughput',
      value: '89%',
      subtitle: 'Section utilization',
      icon: TrendingUp,
      trend: { value: 5, direction: 'up' as const, isPositive: true }
    }
  ];

  const trains = [
    {
      trainNumber: '12615',
      trainName: 'Grand Trunk Express',
      status: 'running' as const,
      currentLocation: 'New Delhi',
      destination: 'Chennai Central',
      scheduledTime: '14:30',
      actualTime: '14:35',
      delay: 5,
      passengers: 1247
    },
    {
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani',
      status: 'delayed' as const,
      currentLocation: 'Agra Cantt',
      destination: 'Mumbai Central',
      scheduledTime: '15:45',
      actualTime: '16:15',
      delay: 30,
      passengers: 892
    },
    {
      trainNumber: '22691',
      trainName: 'Bangalore Express',
      status: 'running' as const,
      currentLocation: 'Gwalior',
      destination: 'Bangalore City',
      scheduledTime: '16:20',
      actualTime: '16:18',
      delay: 0,
      passengers: 1456
    },
    {
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi',
      status: 'warning' as const,
      currentLocation: 'Jhansi',
      destination: 'Bhopal',
      scheduledTime: '17:10',
      actualTime: '17:25',
      delay: 15,
      passengers: 634
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      message: 'Signal failure at Junction A3 - Manual clearance required',
      time: '14:32',
      train: '12615'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Track maintenance scheduled - Platform 2 unavailable 16:00-18:00',
      time: '13:45',
      train: null
    },
    {
      id: 3,
      type: 'info',
      message: 'Weather alert - Heavy rain expected in 2 hours',
      time: '13:20',
      train: null
    }
  ];

  return (
    <Layout activeSection="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Control Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Section A - Real-time Operations Overview
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">System Online</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Trains */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Train className="w-5 h-5" />
                <span>Active Trains</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trains.map((train, index) => (
                <TrainCard key={index} {...train} />
              ))}
            </CardContent>
          </Card>

          {/* Recent Alerts & System Status */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'critical' ? 'bg-destructive' :
                      alert.type === 'warning' ? 'bg-warning' : 'bg-info'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        {alert.train && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            Train {alert.train}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Signaling System</span>
                  <StatusBadge status="running" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Communication Network</span>
                  <StatusBadge status="running" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Track Monitoring</span>
                  <StatusBadge status="warning" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Power Supply</span>
                  <StatusBadge status="running" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;