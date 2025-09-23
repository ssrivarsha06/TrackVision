import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Database, Wifi, Bell, Shield, Users, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddUserDialog from '@/components/AddUserDialog';
import EditUserDialog from '@/components/EditUserDialog';

interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      critical_alerts: true,
      delay_warnings: true,
      maintenance_notices: false,
      email_reports: true,
      sms_alerts: true
    },
    thresholds: {
      delay_warning: '15',
      critical_delay: '30',
      utilization_limit: '90',
      incident_escalation: '2'
    },
    integrations: {
      signaling_system: 'connected',
      tms_integration: 'connected',
      weather_service: 'connected',
      passenger_info: 'disconnected'
    }
  });

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('railway-users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Default users if none exist in localStorage
      const defaultUsers = [
        { id: 1, name: 'Controller A1', role: 'Section Controller', status: 'active', lastLogin: '2024-01-15 14:30' },
        { id: 2, name: 'Supervisor B1', role: 'Supervisor', status: 'active', lastLogin: '2024-01-15 13:45' },
        { id: 3, name: 'Admin User', role: 'System Administrator', status: 'active', lastLogin: '2024-01-15 12:20' },
        { id: 4, name: 'Controller A2', role: 'Section Controller', status: 'inactive', lastLogin: '2024-01-14 18:00' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('railway-users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Save users to localStorage whenever users array changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('railway-users', JSON.stringify(users));
    }
  }, [users]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleTestConnection = (service: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${service}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Connection Test",
        description: `${service} connection is working properly.`,
      });
    }, 2000);
  };

  const getConnectionStatus = (status: string) => {
    switch (status) {
      case 'connected': return { color: 'bg-success text-success-foreground', label: 'Connected' };
      case 'disconnected': return { color: 'bg-destructive text-destructive-foreground', label: 'Disconnected' };
      case 'warning': return { color: 'bg-warning text-warning-foreground', label: 'Warning' };
      default: return { color: 'bg-muted text-muted-foreground', label: 'Unknown' };
    }
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleEditUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "User Deleted",
        description: `${user.name} has been removed from the system.`
      });
    }
  };

  return (
    <Layout activeSection="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure system preferences, integrations, and user management
            </p>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="critical-alerts">Critical Alerts</Label>
                  <p className="text-sm text-muted-foreground">Immediate notifications for critical events</p>
                </div>
                <Switch
                  id="critical-alerts"
                  checked={settings.notifications.critical_alerts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, critical_alerts: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="delay-warnings">Delay Warnings</Label>
                  <p className="text-sm text-muted-foreground">Notifications for train delays</p>
                </div>
                <Switch
                  id="delay-warnings"
                  checked={settings.notifications.delay_warnings}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, delay_warnings: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-notices">Maintenance Notices</Label>
                  <p className="text-sm text-muted-foreground">Scheduled maintenance notifications</p>
                </div>
                <Switch
                  id="maintenance-notices"
                  checked={settings.notifications.maintenance_notices}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, maintenance_notices: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-reports">Email Reports</Label>
                  <p className="text-sm text-muted-foreground">Daily performance reports via email</p>
                </div>
                <Switch
                  id="email-reports"
                  checked={settings.notifications.email_reports}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email_reports: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Alert Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>Alert Thresholds</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delay-warning">Delay Warning Threshold (minutes)</Label>
                <Input
                  id="delay-warning"
                  type="number"
                  value={settings.thresholds.delay_warning}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, delay_warning: e.target.value }
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="critical-delay">Critical Delay Threshold (minutes)</Label>
                <Input
                  id="critical-delay"
                  type="number"
                  value={settings.thresholds.critical_delay}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, critical_delay: e.target.value }
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utilization-limit">Section Utilization Limit (%)</Label>
                <Input
                  id="utilization-limit"
                  type="number"
                  value={settings.thresholds.utilization_limit}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, utilization_limit: e.target.value }
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-escalation">Incident Escalation Count</Label>
                <Input
                  id="incident-escalation"
                  type="number"
                  value={settings.thresholds.incident_escalation}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, incident_escalation: e.target.value }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>System Integrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.integrations).map(([service, status]) => {
                const statusConfig = getConnectionStatus(status);
                
                return (
                  <div key={service} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Wifi className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {service.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {service === 'signaling_system' && 'Railway signaling interface'}
                          {service === 'tms_integration' && 'Train Management System'}
                          {service === 'weather_service' && 'Meteorological data feed'}
                          {service === 'passenger_info' && 'Passenger information system'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(service)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="text-sm text-foreground">{user.lastLogin}</p>
                    </div>
                    <Badge className={user.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                      {user.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              
              <AddUserDialog onAddUser={handleAddUser} />
              
              <EditUserDialog 
                user={editingUser}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onEditUser={handleUpdateUser}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">System Version</p>
                <p className="font-semibold text-foreground">v2.1.4</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-semibold text-foreground">2024-01-10</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Database Status</p>
                <p className="font-semibold text-success">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;