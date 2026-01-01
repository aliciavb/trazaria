import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Apple, Coffee, Sunset, Cookie, Pencil } from 'lucide-react';
import { db, Entry } from '@/lib/db';
import { toLocalDateISO } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Apple,
  dinner: Sunset,
  snack: Cookie,
  activity: null,
};

const MEAL_LABELS = {
  breakfast: 'Desayuno',
  lunch: 'Comida',
  dinner: 'Cena',
  snack: 'Snack',
  activity: 'Actividad',
};

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    loadMonthEntries();
  }, [currentDate]);

  const loadMonthEntries = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const allEntries = await db.entries
      .where('dateISO')
      .between(toLocalDateISO(firstDay), toLocalDateISO(lastDay)) // FIX: Usar fecha local
      .toArray();
    
    setEntries(allEntries);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    return { daysInMonth, startingDayOfWeek };
  };

  const getEntriesForDay = (day: number) => {
    const dateStr = toLocalDateISO(new Date( // FIX: Usar fecha local
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ));
    
    return entries.filter(e => e.dateISO === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Generate calendar grid
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEntries = getEntriesForDay(day);
    const hasData = dayEntries.length > 0;
    const totalKcal = dayEntries.reduce((sum, e) => sum + (e.totalKcal || 0), 0);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    calendarDays.push(
      <div
        key={day}
        onClick={() => setSelectedDay(day)}
        className={`aspect-square p-2 border rounded-lg relative cursor-pointer hover:bg-muted transition-colors ${
          isToday ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <div className="text-sm font-medium">{day}</div>
        {hasData && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        )}
      </div>
    );
  }

  const selectedDayEntries = selectedDay ? getEntriesForDay(selectedDay) : [];
  const selectedDateObj = selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-card shadow-card">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold capitalize">{monthName}</h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 Toca un día con datos para ver y editar los registros de ese día
        </p>
      </Card>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle>
              {selectedDateObj?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </DialogTitle>
            {selectedDateObj && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(`/today?date=${toLocalDateISO(selectedDateObj)}`)}
                title="Editar este día"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            {selectedDayEntries.length > 0 ? (
              <div className="space-y-6 pr-4">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                  const typeEntries = selectedDayEntries.filter(e => e.type === type);
                  if (typeEntries.length === 0) return null;
                  
                  const Icon = MEAL_ICONS[type];
                  const typeTotalKcal = typeEntries.reduce((sum, e) => sum + (e.totalKcal || 0), 0);

                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between border-b pb-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          {Icon && <Icon className="w-4 h-4 text-primary" />}
                          {MEAL_LABELS[type]}
                        </div>
                        <Badge variant="secondary" className="text-xs h-5">
                          {typeTotalKcal} kcal
                        </Badge>
                      </div>
                      <div className="pl-2 border-l-2 border-muted ml-1">
                        {typeEntries.map((entry) => (
                          <div key={entry.id} className="mb-1 last:mb-0">
                            {entry.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1 text-sm group">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-[10px] font-mono text-muted-foreground w-8 shrink-0">
                                    {idx === 0 ? entry.time : ''}
                                  </span>
                                  <span className="truncate text-foreground/90 group-hover:text-foreground transition-colors">
                                    {item.name}
                                  </span>
                                </div>
                                {item.kcal && item.kcal > 0 ? (
                                  <span className="text-xs text-muted-foreground ml-2 shrink-0 tabular-nums">
                                    {item.kcal}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No hay registros para este día
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
