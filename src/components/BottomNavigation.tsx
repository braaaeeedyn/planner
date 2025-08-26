import { Home, Plus, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Plus, label: 'Add', path: '/add' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "drop-shadow-sm")} />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}