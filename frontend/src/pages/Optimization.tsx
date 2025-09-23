import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, XCircle, Clock, Route, AlertTriangle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Optimization = () => {
  const { toast } = useToast();
  const [processingRecommendation, setProcessingRecommendation] = useState<string | null>(null);

  const recommendations = [
    {
      id: 'rec_001',
      type: 'crossing',
      priority: 'high',
      title: 'Optimize Train Crossing at Junction A2',
      description: 'Allow 12951 (Mumbai Rajdhani) to cross before 22691 (Bangalore Express) to minimize overall delay.',
      impact: {
        delay_reduction: '8 minutes',
        throughput_improvement: '12%',
        affected_trains: ['12951', '22691']
      },
      confidence: 94,
      estimated_savings: '₹2.4L'
    },
    {
      id: 'rec_002',
      type: 'rerouting',
      priority: 'medium',
      title: 'Alternative Route for 12615',
      description: 'Reroute Grand Trunk Express via bypass track to avoid congestion at Junction A3.',
      impact: {
        delay_reduction: '15 minutes',
        throughput_improvement: '8%',
        affected_trains: ['12615']
      },
      confidence: 87,
      estimated_savings: '₹1.8L'
    },
    {
      id: 'rec_003',
      type: 'scheduling',
      priority: 'low',
      title: 'Adjust Platform Allocation',
      description: 'Move incoming local train to Platform 3 to free Platform 1 for express services.',
      impact: {
        delay_reduction: '5 minutes',
        throughput_improvement: '15%',
        affected_trains: ['Local-456', '12002']
      },
      confidence: 91,
      estimated_savings: '₹0.9L'
    }
  ];

  const handleApprove = async (id: string) => {
    setProcessingRecommendation(id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Recommendation Approved",
      description: "AI optimization has been implemented successfully.",
    });
    setProcessingRecommendation(null);
  };

  const handleReject = (id: string) => {
    toast({
      title: "Recommendation Rejected",
      description: "The recommendation has been marked as rejected.",
      variant: "destructive",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crossing': return Route;
      case 'rerouting': return Route;
      case 'scheduling': return Clock;
      default: return Brain;
    }
  };

  return (
    <Layout activeSection="optimization">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Recommendations</h1>
            <p className="text-muted-foreground mt-1">
              Intelligent optimization suggestions for improved efficiency
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">AI Engine Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-success">Processing</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => toast({ title: "AI Processing", description: "Generating new recommendations based on current conditions..." })}>
              <Brain className="w-4 h-4 mr-2" />
              Generate New Recommendations
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Recommendations</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Potential Savings</p>
                  <p className="text-2xl font-bold text-foreground">₹5.1L</p>
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold text-foreground">91%</p>
                </div>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delay Reduction</p>
                  <p className="text-2xl font-bold text-foreground">28 min</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const TypeIcon = getTypeIcon(rec.type);
            const isProcessing = processingRecommendation === rec.id;
            
            return (
              <Card key={rec.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <TypeIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-xl font-bold text-foreground">{rec.confidence}%</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Delay Reduction</p>
                      <p className="font-semibold text-success">{rec.impact.delay_reduction}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Throughput Gain</p>
                      <p className="font-semibold text-primary">{rec.impact.throughput_improvement}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Est. Savings</p>
                      <p className="font-semibold text-foreground">{rec.estimated_savings}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Affected Trains:</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.impact.affected_trains.map((train) => (
                        <Badge key={train} variant="outline">{train}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReject(rec.id)}
                      disabled={isProcessing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(rec.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Implement
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Insights & Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Traffic Patterns</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Peak congestion detected at Junction A2 (14:30-16:00)</li>
                  <li>• Express train delays causing cascading effects</li>
                  <li>• Platform utilization at 78% - within optimal range</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Optimization Opportunities</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Implement dynamic scheduling for 15% efficiency gain</li>
                  <li>• Use bypass tracks during peak hours</li>
                  <li>• Coordinate with adjacent sections for better flow</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Optimization;