import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sun, Moon, CloudSun, Stars } from 'lucide-react';

const AtmosphereWidget = () => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 13) {
      setTimeOfDay('morning');
      setGreeting('Buenos días');
    } else if (hour >= 13 && hour < 20) {
      setTimeOfDay('afternoon');
      setGreeting('Buenas tardes');
    } else {
      setTimeOfDay('night');
      setGreeting('Buenas noches');
    }
  }, []);

  const getIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-8 h-8 text-amber-500 animate-pulse-slow" />;
      case 'afternoon':
        return <CloudSun className="w-8 h-8 text-orange-400" />;
      case 'night':
        return <Moon className="w-8 h-8 text-indigo-300" />;
    }
  };

  const getMessage = () => {
    switch (timeOfDay) {
      case 'morning':
        return "A por el día con energía.";
      case 'afternoon':
        return "¿Qué tal va el día?";
      case 'night':
        return "Momento de descansar.";
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-none shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-full shadow-sm">
          {getIcon()}
        </div>
        <div>
          <h2 className="font-serif text-xl font-medium text-slate-800">
            {greeting}
          </h2>
          <p className="text-sm text-slate-500 font-serif">
            {getMessage()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AtmosphereWidget;
