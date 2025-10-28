import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db, Entry } from '@/lib/db';
import { toLocalDateISO } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const WeekView = () => {
  const [weekEntries, setWeekEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState({
    avgKcal: 0,
    avgProtein: 0,
    avgCarbs: 0,
    avgFat: 0,
  });

  useEffect(() => {
    loadWeekData();
  }, []);

  const loadWeekData = async () => {
    // Get last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const entries = await db.entries
      .where('dateISO')
      .between(
        toLocalDateISO(sevenDaysAgo), // FIX: Usar fecha local
        toLocalDateISO(today) // FIX: Usar fecha local
      )
      .toArray();

    setWeekEntries(entries);

    // Calculate averages
    if (entries.length > 0) {
      const totalKcal = entries.reduce((sum, e) => sum + (e.totalKcal || 0), 0);
      const totalProtein = entries.reduce((sum, e) => 
        sum + e.items.reduce((s, i) => s + (i.protein || 0), 0), 0
      );
      const totalCarbs = entries.reduce((sum, e) => 
        sum + e.items.reduce((s, i) => s + (i.carbs || 0), 0), 0
      );
      const totalFat = entries.reduce((sum, e) => 
        sum + e.items.reduce((s, i) => s + (i.fat || 0), 0), 0
      );

      const daysWithData = new Set(entries.map(e => e.dateISO)).size;

      setStats({
        avgKcal: Math.round(totalKcal / daysWithData),
        avgProtein: Math.round(totalProtein / daysWithData),
        avgCarbs: Math.round(totalCarbs / daysWithData),
        avgFat: Math.round(totalFat / daysWithData),
      });
    }
  };

  const getDailyData = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = toLocalDateISO(date); // FIX: Usar fecha local
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });

      const dayEntries = weekEntries.filter(e => e.dateISO === dateStr);
      const totalKcal = dayEntries.reduce((sum, e) => sum + (e.totalKcal || 0), 0);

      days.push({
        date: dateStr,
        dayName,
        kcal: totalKcal,
        hasData: dayEntries.length > 0,
      });
    }

    return days;
  };

  const dailyData = getDailyData();
  const maxKcal = Math.max(...dailyData.map(d => d.kcal), 2000);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Promedio kcal</p>
          </div>
          <p className="text-2xl font-bold">{stats.avgKcal}</p>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Proteína</p>
          </div>
          <p className="text-2xl font-bold">{stats.avgProtein}g</p>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Carbohidratos</p>
          </div>
          <p className="text-2xl font-bold">{stats.avgCarbs}g</p>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Grasas</p>
          </div>
          <p className="text-2xl font-bold">{stats.avgFat}g</p>
        </Card>
      </div>

      <Card className="p-4 bg-gradient-card shadow-card">
        <h3 className="font-semibold mb-4">Calorías por día</h3>
        <div className="space-y-3">
          {dailyData.map(day => (
            <div key={day.date} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{day.dayName}</span>
                <span className="text-muted-foreground">{day.kcal} kcal</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-warm h-full transition-all"
                  style={{ width: `${(day.kcal / maxKcal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {weekEntries.length === 0 && (
        <Card className="p-8 text-center bg-muted/50">
          <p className="text-muted-foreground">
            No hay datos de esta semana aún
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Empieza a registrar tus comidas para ver las estadísticas
          </p>
        </Card>
      )}
    </div>
  );
};

export default WeekView;
