import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNav from '@/components/BottomNav';
import CalendarView from '@/components/CalendarView';
import WeekView from '@/components/WeekView';
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

const Overview = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <>
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Resumen</h1>
            <p className="text-muted-foreground">
              Vista general de tu progreso
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Calendario
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Semana
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-6">
              <CalendarView />
            </TabsContent>

            <TabsContent value="week" className="mt-6">
              <WeekView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Overview;
