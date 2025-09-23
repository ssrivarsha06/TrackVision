import React from 'react';
import { Train, BarChart3, Map, AlertTriangle, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection = 'dashboard' }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, href: '/' },
    { id: 'section-map', name: 'Section Map', icon: Map, href: '/section-map' },
    { id: 'optimization', name: 'AI Recommendations', icon: Train, href: '/optimization' },
    { id: 'alerts', name: 'Alerts & Notifications', icon: AlertTriangle, href: '/alerts' },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3, href: '/analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Train className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Railway Control</h1>
                <p className="text-sm text-muted-foreground">Section Management</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Controller A1</p>
              <p className="text-xs text-muted-foreground">Section A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;