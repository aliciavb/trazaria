import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Entry } from '@/lib/db';
import { Moon, Sun, Sunset } from 'lucide-react';

interface AtmosphereWidgetProps {
  entries: Entry[];
  onCheckIn: (satiety: 'very-hungry' | 'hungry' | 'satisfied' | 'full' | 'very-full') => void;
  onUndoCheckIn: (entryId: string) => void;
  isToday: boolean;
  city?: string;
}

const AtmosphereWidget = ({ entries, onCheckIn, onUndoCheckIn, isToday, city }: AtmosphereWidgetProps) => {
  const [greeting, setGreeting] = useState('');
  const [currentCheckIn, setCurrentCheckIn] = useState<Entry | null>(null);
  const [Icon, setIcon] = useState(Sun);

  const options = [
    { value: 'very-hungry', label: 'Mucha hambre' },
    { value: 'hungry', label: 'Algo de hambre' },
    { value: 'satisfied', label: 'Saciado' },
    { value: 'full', label: 'Lleno' },
    { value: 'very-full', label: 'Muy lleno' },
  ] as const;

  useEffect(() => {
    const updateState = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const time = hour * 60 + minute;

      // Greeting Logic
      let greetingText = '';
      if (hour < 12) {
        greetingText = 'Buenos días';
        setIcon(Sun);
      } else if (hour < 20) {
        greetingText = 'Buenas tardes';
        setIcon(Sunset);
      } else {
        greetingText = 'Buenas noches';
        setIcon(Moon);
      }
      
      if (city) {
        greetingText += ` en ${city}`;
      }
      setGreeting(greetingText);

      if (!isToday) {
        setCurrentCheckIn(null);
        return;
      }

      // Windows
      // 08:01 (481) - 16:00 (960)
      // 16:01 (961) - 23:00 (1380)
      // 23:01 (1381) - 08:00 (480)
      
      const w1Start = 8 * 60 + 1;
      const w2Start = 16 * 60 + 1;
      const w3Start = 23 * 60 + 1;

      let currentWindow = 0;
      if (time >= w1Start && time < w2Start) currentWindow = 1;
      else if (time >= w2Start && time < w3Start) currentWindow = 2;
      else if (time >= w3Start || time < w1Start) currentWindow = 3;

      // Check for existing checkin in this window
      const foundCheckin = entries.find(e => {
        if (e.type !== 'checkin') return false;
        if (!e.time) return false;
        const [h, m] = e.time.split(':').map(Number);
        const entryTime = h * 60 + m;

        if (currentWindow === 1) return entryTime >= w1Start && entryTime < w2Start;
        if (currentWindow === 2) return entryTime >= w2Start && entryTime < w3Start;
        if (currentWindow === 3) return entryTime >= w3Start || entryTime < w1Start;
        return false;
      });

      setCurrentCheckIn(foundCheckin || null);
    };

    updateState();
    const interval = setInterval(updateState, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [entries, isToday]);

  const getLabel = (value: string) => options.find(o => o.value === value)?.label || value;

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-none shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="font-serif text-xl font-medium text-slate-800">
            {greeting}
          </h2>
        </div>
        
        {isToday && (
          <div className="animate-in fade-in slide-in-from-top-2">
            {currentCheckIn ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-serif">
                  Guardado: <span className="font-medium text-slate-900">{currentCheckIn.wellbeing?.hunger ? getLabel(currentCheckIn.wellbeing.hunger) : 'Guardado'}</span>
                </p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs text-slate-400 hover:text-slate-600"
                  onClick={() => currentCheckIn.id && onUndoCheckIn(currentCheckIn.id)}
                >
                  Deshacer
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-500 font-serif">
                  ¿Cómo te sientes?
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      onClick={() => onCheckIn(option.value)}
                      className="bg-white/50 hover:bg-white border-slate-200 text-slate-600 hover:text-slate-900 transition-all"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AtmosphereWidget;
