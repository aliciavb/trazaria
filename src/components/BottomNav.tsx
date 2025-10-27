import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, Settings, Plus, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/today', icon: Home, label: 'Hoy' },
    { path: '/overview', icon: BarChart3, label: 'Resumen' },
    { path: '/', icon: Plus, label: 'Registrar', isPrimary: true },
    { path: '/database', icon: Database, label: 'Base' },
    { path: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (item.isPrimary) {
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  size="icon"
                  className="w-14 h-14 rounded-full bg-gradient-warm shadow-elevated -mt-6"
                >
                  <Icon className="w-6 h-6" />
                </Button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
