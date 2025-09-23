import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Train, AlertTriangle, Radio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SectionMap = () => {
  const { toast } = useToast();
  const [selectedJunction, setSelectedJunction] = useState('Junction A1');
  
  const trackSections = [
    { id: 'A1', name: 'New Delhi - Agra', status: 'clear', trains: ['12615'] },
    { id: 'A2', name: 'Agra - Gwalior', status: 'occupied', trains: ['12951'] },
    { id: 'A3', name: 'Gwalior - Jhansi', status: 'signal_failure', trains: [] },
    { id: 'A4', name: 'Jhansi - Bhopal', status: 'clear', trains: ['22691'] },
  ];

  const signals = [
    { id: 'S1', position: 'Junction A1', status: 'green', aspect: 'PROCEED' },
    { id: 'S2', position: 'Junction A2', status: 'yellow', aspect: 'CAUTION' },
    { id: 'S3', position: 'Junction A3', status: 'red', aspect: 'STOP - MANUAL' },
    { id: 'S4', position: 'Junction A4', status: 'green', aspect: 'PROCEED' },
  ];

  const getTrackColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-success';
      case 'occupied': return 'bg-warning';
      case 'signal_failure': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getSignalColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-success';
      case 'yellow': return 'bg-warning';
      case 'red': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const handleSignalControl = (action: string) => {
    toast({
      title: "Signal Control",
      description: `${action} signal sent to ${selectedJunction}`,
    });
  };

  return (
    <Layout activeSection="section-map">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Section Map</h1>
            <p className="text-muted-foreground mt-1">
              Real-time track visualization and train positions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm">Clear</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-sm">Alert</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Track Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Map className="w-5 h-5" />
                <span>Track Layout - Section A</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Track visualization */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">New Delhi</div>
                    <div className="text-sm font-medium text-muted-foreground">Bhopal</div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    {trackSections.map((section, index) => (
                      <div key={section.id} className="relative">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {section.id}
                          </Badge>
                          <div className="flex-1 h-8 bg-muted rounded-lg relative overflow-hidden">
                            <div 
                              className={`absolute inset-0 ${getTrackColor(section.status)} opacity-80`}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {section.name}
                              </span>
                            </div>
                            
                            {/* Train positions */}
                            {section.trains.map((train, trainIndex) => (
                              <div 
                                key={train} 
                                className="absolute top-1 bottom-1 w-16 bg-primary rounded flex items-center justify-center"
                                style={{ left: `${20 + (trainIndex * 70)}%` }}
                              >
                                <Train className="w-3 h-3 text-primary-foreground" />
                                <span className="text-xs text-primary-foreground ml-1">
                                  {train}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {section.status === 'signal_failure' && (
                          <div className="mt-1 flex items-center space-x-2 text-destructive">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs">Signal system failure detected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Junction points */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-foreground mb-3">Junction Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {signals.map((signal) => (
                      <div key={signal.id} className="flex items-center space-x-3 p-2 border border-border rounded">
                        <div className={`w-3 h-3 rounded-full ${getSignalColor(signal.status)}`} />
                        <div>
                          <div className="text-sm font-medium">{signal.position}</div>
                          <div className="text-xs text-muted-foreground">{signal.aspect}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Signal Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radio className="w-5 h-5" />
                  <span>Signal Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Active Junction</label>
                  <select 
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                    value={selectedJunction}
                    onChange={(e) => setSelectedJunction(e.target.value)}
                  >
                    <option value="Junction A1">Junction A1</option>
                    <option value="Junction A2">Junction A2</option>
                    <option value="Junction A3">Junction A3 (MANUAL)</option>
                    <option value="Junction A4">Junction A4</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className="px-3 py-2 bg-success text-success-foreground rounded text-sm font-medium hover:bg-success/80 transition-colors"
                    onClick={() => handleSignalControl('CLEAR')}
                  >
                    CLEAR
                  </button>
                  <button 
                    className="px-3 py-2 bg-warning text-warning-foreground rounded text-sm font-medium hover:bg-warning/80 transition-colors"
                    onClick={() => handleSignalControl('CAUTION')}
                  >
                    CAUTION
                  </button>
                  <button 
                    className="px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm font-medium hover:bg-destructive/80 transition-colors"
                    onClick={() => handleSignalControl('STOP')}
                  >
                    STOP
                  </button>
                  <button 
                    className="px-3 py-2 bg-muted text-muted-foreground rounded text-sm font-medium hover:bg-muted/80 transition-colors"
                    onClick={() => handleSignalControl('MANUAL')}
                  >
                    MANUAL
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Train Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Train className="w-5 h-5" />
                  <span>Train Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border border-border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">12615</span>
                    <Badge className="bg-success text-success-foreground">Running</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Grand Trunk Express</p>
                  <p className="text-xs text-muted-foreground mt-1">Current: Section A1</p>
                  <p className="text-xs text-muted-foreground">Speed: 85 km/h</p>
                </div>

                <div className="p-3 border border-border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">12951</span>
                    <Badge className="bg-warning text-warning-foreground">Delayed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Mumbai Rajdhani</p>
                  <p className="text-xs text-muted-foreground mt-1">Current: Section A2</p>
                  <p className="text-xs text-muted-foreground">Speed: 65 km/h</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SectionMap;