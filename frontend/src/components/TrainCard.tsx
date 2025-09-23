import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface TrainCardProps {
  trainNumber: string;
  trainName: string;
  status: 'running' | 'delayed' | 'stopped' | 'warning' | 'maintenance';
  currentLocation: string;
  destination: string;
  scheduledTime: string;
  actualTime: string;
  delay?: number;
  passengers?: number;
}

const TrainCard: React.FC<TrainCardProps> = ({
  trainNumber,
  trainName,
  status,
  currentLocation,
  destination,
  scheduledTime,
  actualTime,
  delay = 0,
  passengers
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {trainNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{trainName}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">At: {currentLocation}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">To: {destination}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="text-foreground">{scheduledTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actual:</span>
              <span className={delay > 0 ? "text-warning" : "text-success"}>
                {actualTime}
              </span>
            </div>
          </div>
        </div>

        {delay > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Delay: </span>
            <span className="text-warning font-medium">{delay} min</span>
          </div>
        )}

        {passengers && (
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{passengers} passengers</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainCard;