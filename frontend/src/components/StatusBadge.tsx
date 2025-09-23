import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'running' | 'delayed' | 'stopped' | 'warning' | 'maintenance';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'running':
        return {
          label: 'Running',
          variant: 'default' as const,
          className: 'bg-success text-success-foreground'
        };
      case 'delayed':
        return {
          label: 'Delayed',
          variant: 'default' as const,
          className: 'bg-warning text-warning-foreground'
        };
      case 'stopped':
        return {
          label: 'Stopped',
          variant: 'destructive' as const,
          className: ''
        };
      case 'warning':
        return {
          label: 'Warning',
          variant: 'default' as const,
          className: 'bg-warning text-warning-foreground'
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          variant: 'secondary' as const,
          className: ''
        };
      default:
        return {
          label: status,
          variant: 'default' as const,
          className: ''
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;