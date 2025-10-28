import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db, Entry } from '@/lib/db';
import { toLocalDateISO } from '@/lib/utils';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);

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
        className={`aspect-square p-2 border rounded-lg ${
          isToday ? 'border-primary bg-primary/5' : 'border-border'
        } ${hasData ? 'bg-gradient-card' : ''}`}
      >
        <div className="text-sm font-medium">{day}</div>
        {hasData && (
          <div className="mt-1">
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {totalKcal} kcal
            </Badge>
          </div>
        )}
      </div>
    );
  }

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
    </div>
  );
};

export default CalendarView;
