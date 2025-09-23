import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Train, Zap, CloudRain, Construction } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  const alerts = [
    {
      id: 'ALT_001',
      type: 'critical',
      category: 'signal',
      title: 'Signal System Failure - Junction A3',
      description: 'Automatic signaling failed. Manual control required for all movements through Junction A3.',
      timestamp: '2024-01-15 14:32:15',
      train: '12615',
      location: 'Junction A3',
      status: 'active',
      priority: 1,
      estimated_resolution: '30 minutes',
      assigned_to: 'Signal Maintainer Team A'
    },
    {
      id: 'ALT_002',
      type: 'warning',
      category: 'delay',
      title: 'Train Running Late - 12951',
      description: 'Mumbai Rajdhani delayed by 30 minutes due to late departure from previous station.',
      timestamp: '2024-01-15 14:15:22',
      train: '12951',
      location: 'Agra Cantt',
      status: 'active',
      priority: 2,
      estimated_resolution: '15 minutes',
      assigned_to: 'Controller A1'
    },
    {
      id: 'ALT_003',
      type: 'info',
      category: 'weather',
      title: 'Weather Alert - Heavy Rain Expected',
      description: 'Meteorological department predicts heavy rainfall in 2 hours. Prepare for speed restrictions.',
      timestamp: '2024-01-15 13:20:45',
      train: null,
      location: 'Section A - All Stations',
      status: 'active',
      priority: 3,
      estimated_resolution: '4 hours',
      assigned_to: 'All Controllers'
    },
    {
      id: 'ALT_004',
      type: 'warning',
      category: 'maintenance',
      title: 'Planned Track Maintenance',
      description: 'Platform 2 unavailable for train operations from 16:00 to 18:00 today.',
      timestamp: '2024-01-15 13:45:10',
      train: null,
      location: 'Platform 2',
      status: 'scheduled',
      priority: 2,
      estimated_resolution: '2 hours',
      assigned_to: 'Maintenance Team B'
    },
    {
      id: 'ALT_005',
      type: 'critical',
      category: 'safety',
      title: 'Track Obstruction Detected',
      description: 'Automated sensors detected obstruction on Track 1 between KM 45-46. Inspection required.',
      timestamp: '2024-01-15 12:55:30',
      train: null,
      location: 'Track 1 (KM 45-46)',
      status: 'resolved',
      priority: 1,
      estimated_resolution: 'Completed',
      assigned_to: 'Track Patrol Team'
    }
  ];

  const getAlertIcon = (category: string) => {
    switch (category) {
      case 'signal': return Zap;
      case 'delay': return Clock;
      case 'weather': return CloudRain;
      case 'maintenance': return Construction;
      case 'safety': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'info': return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-destructive text-destructive-foreground';
      case 'scheduled': return 'bg-warning text-warning-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    toast({
      title: "Alert Acknowledged",
      description: `Alert ${alertId} has been acknowledged and assigned for resolution.`,
    });
  };

  const handleResolve = (alertId: string) => {
    toast({
      title: "Alert Resolved",
      description: `Alert ${alertId} has been marked as resolved.`,
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.type === 'critical';
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'resolved') return alert.status === 'resolved';
    return true;
  });

  const alertCounts = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    active: alerts.filter(a => a.status === 'active').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  return (
    <Layout activeSection="alerts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Real-time system alerts and operational notifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Alert System</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-success">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold text-foreground">{alertCounts.total}</p>
                </div>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-destructive">{alertCounts.critical}</p>
                </div>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-warning">{alertCounts.active}</p>
                </div>
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-success">{alertCounts.resolved}</p>
                </div>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'critical', label: 'Critical' },
            { id: 'active', label: 'Active' },
            { id: 'resolved', label: 'Resolved' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={filter === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.category);
            
            return (
              <Card key={alert.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <AlertIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <Badge className={getAlertColor(alert.type)}>
                            {alert.type}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <p className="text-xl font-bold text-foreground">{alert.priority}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{alert.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="font-medium text-foreground">{alert.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Resolution Time</p>
                      <p className="font-medium text-foreground">{alert.estimated_resolution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium text-foreground">{alert.assigned_to}</p>
                    </div>
                  </div>

                  {alert.train && (
                    <div className="mb-4">
                      <Badge variant="outline" className="mr-2">
                        <Train className="w-3 h-3 mr-1" />
                        Train {alert.train}
                      </Badge>
                    </div>
                  )}

                  {alert.status === 'active' && (
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No alerts found for the selected filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;