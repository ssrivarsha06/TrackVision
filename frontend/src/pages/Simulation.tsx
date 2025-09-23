import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Simulation = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('current');

  const scenarios = [
    {
      id: 'current',
      name: 'Current Operations',
      description: 'Baseline scenario with existing schedules and routing',
      status: 'baseline'
    },
    {
      id: 'optimized',
      name: 'AI Optimized',
      description: 'Implementation of all AI recommendations',
      status: 'recommended'
    },
    {
      id: 'emergency',
      name: 'Emergency Protocol',
      description: 'Signal failure at Junction A3 response plan',
      status: 'emergency'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Mode',
      description: 'Track maintenance window 02:00-06:00',
      status: 'maintenance'
    }
  ];

  const simulationResults = {
    current: {
      total_delay: '45 minutes',
      throughput: '24 trains/hour',
      efficiency: '76%',
      cost: '₹8.2L',
      incidents: 2
    },
    optimized: {
      total_delay: '18 minutes',
      throughput: '32 trains/hour',
      efficiency: '94%',
      cost: '₹5.8L',
      incidents: 0
    },
    emergency: {
      total_delay: '125 minutes',
      throughput: '12 trains/hour',
      efficiency: '45%',
      cost: '₹15.6L',
      incidents: 5
    },
    maintenance: {
      total_delay: '35 minutes',
      throughput: '18 trains/hour',
      efficiency: '68%',
      cost: '₹9.1L',
      incidents: 1
    }
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    toast({
      title: "Simulation Started",
      description: `Running ${scenarios.find(s => s.id === selectedScenario)?.name} scenario...`,
    });
    
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Simulation Complete",
        description: "Results are ready for analysis.",
      });
    }, 3000);
  };

  const handleReset = () => {
    setIsRunning(false);
    toast({
      title: "Simulation Reset",
      description: "All parameters have been reset to default values.",
    });
  };

  const getScenarioColor = (status: string) => {
    switch (status) {
      case 'baseline': return 'bg-muted text-muted-foreground';
      case 'recommended': return 'bg-success text-success-foreground';
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      case 'maintenance': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const currentResults = simulationResults[selectedScenario as keyof typeof simulationResults];

  return (
    <Layout activeSection="simulation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Simulation & What-If Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Test alternative scenarios and evaluate their impact
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Configuration", description: "Opening scenario configuration panel..." })}>
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Scenario Saved", description: "Current scenario saved to library." })}>
              <Save className="w-4 h-4 mr-2" />
              Save Scenario
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Scenario Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedScenario === scenario.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-foreground">{scenario.name}</h4>
                    <Badge className={getScenarioColor(scenario.status)}>
                      {scenario.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              ))}

              {/* Control Panel */}
              <div className="pt-4 border-t space-y-2">
                <Button 
                  onClick={handleRunSimulation} 
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={handleReset} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Parameters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Delay</p>
                    <p className="text-lg font-bold text-foreground">{currentResults.total_delay}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Throughput</p>
                    <p className="text-lg font-bold text-foreground">{currentResults.throughput}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-lg font-bold text-foreground">{currentResults.efficiency}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Op. Cost</p>
                    <p className="text-lg font-bold text-foreground">{currentResults.cost}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Incidents</p>
                    <p className="text-lg font-bold text-foreground">{currentResults.incidents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Scenario Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(simulationResults).map(([scenarioId, results]) => {
                    const scenario = scenarios.find(s => s.id === scenarioId);
                    const isSelected = scenarioId === selectedScenario;
                    
                    return (
                      <div key={scenarioId} className={`p-4 border rounded-lg ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-foreground">{scenario?.name}</h4>
                          <Badge className={getScenarioColor(scenario?.status || '')}>
                            {results.efficiency}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Delay: </span>
                            <span className="font-medium">{results.total_delay}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Throughput: </span>
                            <span className="font-medium">{results.throughput}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost: </span>
                            <span className="font-medium">{results.cost}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Incidents: </span>
                            <span className="font-medium">{results.incidents}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Export Started", description: "Exporting simulation results to CSV..." })}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Results (CSV)
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Report Generated", description: "PDF report generated successfully." })}>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report (PDF)
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Saved", description: "Results saved to simulation library." })}>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Library
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">Analysis Summary</p>
                  <p className="text-sm text-muted-foreground">
                    The AI Optimized scenario shows {selectedScenario === 'optimized' ? 'significant improvements with 60% delay reduction and 29% cost savings compared to current operations.' : 'potential for optimization. Consider implementing AI recommendations for better performance.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Simulation;