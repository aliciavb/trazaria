import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Apple, Coffee, Sunset, Cookie, Pencil, Copy, Search, Plus, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { db, Entry, FoodItem } from '@/lib/db';
import { toLocalDateISO } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Add Entry State
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');

  useEffect(() => {
    const searchFoods = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      const results = await db.foods
        .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .limit(5)
        .toArray();
      setSuggestions(results);
    };
    const timeout = setTimeout(searchFoods, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleAddEntry = async () => {
    if (!selectedFood || !selectedDay) return;
    
    try {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
      const dateISO = toLocalDateISO(date);
      
      const qtyVal = parseFloat(quantity) || 0;
      if (qtyVal <= 0) {
        toast({ title: 'Error', description: 'Cantidad inválida', variant: 'destructive' });
        return;
      }
      
      const ratio = qtyVal / 100;
      
      const kcal = Number((selectedFood.nutritionPer100.kcal * ratio).toFixed(1));
      const protein = Number((selectedFood.nutritionPer100.protein * ratio).toFixed(1));
      const fat = Number((selectedFood.nutritionPer100.fat * ratio).toFixed(1));
      const carbs = Number((selectedFood.nutritionPer100.carbs * ratio).toFixed(1));

      const newEntry: Entry = {
        id: `entry-${Date.now()}`,
        dateISO,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        type: mealType,
        items: [{
          foodId: selectedFood.id,
          name: selectedFood.name,
          qty: qtyVal,
          unit: 'g',
          kcal,
          protein,
          fat,
          carbs,
        }],
        totalKcal: kcal,
      };

      await db.entries.add(newEntry);
      
      toast({
        title: 'Añadido',
        description: 'Entrada añadida correctamente',
      });

      // Reset and refresh
      setIsAddingEntry(false);
      setSelectedFood(null);
      setSearchTerm('');
      setQuantity('100');
      await loadMonthEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la entrada',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadMonthEntries();
  }, [currentDate]);

  const loadMonthEntries = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    // Use first day of next month to ensure we cover the full current month
    const nextMonthFirstDay = new Date(year, month + 1, 1);
    
    const allEntries = await db.entries
      .where('dateISO')
      .between(toLocalDateISO(firstDay), toLocalDateISO(nextMonthFirstDay)) 
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

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await db.entries.delete(entryId);
      toast({ title: 'Eliminado', description: 'Registro eliminado' });
      await loadMonthEntries();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'No se pudo eliminar', variant: 'destructive' });
    }
  };

  const handleDuplicate = async (targetDate: Date) => {
    if (!selectedDayEntries.length) return;

    const targetDateStr = toLocalDateISO(targetDate);
    
    // Check if target is same as source
    if (selectedDateObj && toLocalDateISO(selectedDateObj) === targetDateStr) {
      toast({
        title: "Fecha inválida",
        description: "No puedes duplicar al mismo día",
        variant: "destructive"
      });
      return;
    }

    try {
      const newEntries = selectedDayEntries.map((entry, index) => ({
        ...entry,
        id: `entry-${Date.now()}-${index}`,
        dateISO: targetDateStr,
      }));

      await db.entries.bulkAdd(newEntries);
      
      toast({
        title: "¡Duplicado!",
        description: `Se han copiado ${newEntries.length} registros al ${targetDate.toLocaleDateString()}`,
      });

      // Refresh if we copied to a day in the current view
      loadMonthEntries();
      setSelectedDay(null); // Close dialog
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudieron copiar los registros",
        variant: "destructive"
      });
    }
  };

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
          💡 Toca un día para ver y editar los registros
        </p>
      </Card>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => { if (!open) { setSelectedDay(null); setIsAddingEntry(false); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle>
              {selectedDateObj?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </DialogTitle>
            <div className="flex gap-1">
              {selectedDateObj && selectedDayEntries.length > 0 && !isAddingEntry && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Duplicar día completo"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={undefined}
                      onSelect={(date) => date && handleDuplicate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
              {selectedDateObj && !isAddingEntry && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(`/today?date=${toLocalDateISO(selectedDateObj)}`)}
                  title="Ver vista completa (Hoy)"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              {selectedDateObj && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="ml-2 gap-1"
                  onClick={() => setIsAddingEntry(!isAddingEntry)}
                  title={isAddingEntry ? "Volver" : "Añadir alimento"}
                >
                  {isAddingEntry ? <ArrowLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {!isAddingEntry && <span>Añadir</span>}
                </Button>
              )}
            </div>
          </DialogHeader>
          
          {isAddingEntry ? (
            <div className="space-y-4 py-2">
               <div className="space-y-2">
                 <Label>Buscar alimento</Label>
                 <div className="relative">
                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input 
                     placeholder="Ej: Manzana" 
                     className="pl-8"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     autoFocus
                   />
                   {suggestions.length > 0 && (
                     <div className="absolute z-10 w-full bg-popover border rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                       {suggestions.map(food => (
                         <button
                           key={food.id}
                           className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                           onClick={() => {
                             setSelectedFood(food);
                             setSuggestions([]);
                             setSearchTerm(food.name);
                           }}
                         >
                           {food.name} ({Math.round(food.nutritionPer100.kcal)} kcal)
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
               </div>

               {selectedFood && (
                 <div className="space-y-4 border rounded-md p-3 bg-muted/20 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedFood.name}</span>
                      <Badge variant="outline">{Math.round(selectedFood.nutritionPer100.kcal)} kcal/100g</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cantidad (g)</Label>
                        <Input 
                          type="number" 
                          value={quantity} 
                          onChange={(e) => setQuantity(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Comida</Label>
                        <Select value={mealType} onValueChange={(v: any) => setMealType(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Desayuno</SelectItem>
                            <SelectItem value="lunch">Comida</SelectItem>
                            <SelectItem value="dinner">Cena</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full" onClick={handleAddEntry}>
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir registro
                    </Button>
                 </div>
               )}
            </div>
          ) : (
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
                          {Number(typeTotalKcal.toFixed(1))} kcal
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
                                <div className="flex items-center gap-2">
                                  {item.kcal && item.kcal > 0 ? (
                                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                                      {Number(item.kcal.toFixed(1))}
                                    </span>
                                  ) : null}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    title="Eliminar registro"
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
