import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { db, Entry, UserProfile } from '@/lib/db';
import { getCalorieFormulaExplanation } from '@/lib/calories';
import { getTodayDateISO } from '@/lib/utils';
import { Apple, Coffee, Sunset, Cookie, Flame, MoreVertical, Trash2, Copy, Info, Smile, Meh, Frown, SmilePlus, Pizza, Pencil, Plus } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SeasonalWidget from '@/components/SeasonalWidget';
import AtmosphereWidget from '@/components/AtmosphereWidget';

type EntryItem = Entry['items'][number];

interface EditingItem extends Omit<EntryItem, 'qty' | 'kcal'> {
  qty: number | string;
  kcal: number | string;
  _kcalPerUnit?: number;
}

interface EditingEntry extends Omit<Entry, 'items'> {
  items: EditingItem[];
}

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

// Helper para obtener el display name dinámicamente desde la BD
const getFoodDisplayName = async (foodId?: string, fallbackName?: string): Promise<string> => {
  if (!foodId) return fallbackName || '';
  
  try {
    const food = await db.foods.get(foodId);
    if (!food) return fallbackName || '';
    
    return food.brand ? `${food.name} (${food.brand})` : food.name;
  } catch {
    return fallbackName || '';
  }
};

const Today = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [foodNames, setFoodNames] = useState<Record<string, string>>({});
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const { toast } = useToast();

  const loadTodayData = useCallback(async () => {
    const today = dateParam || getTodayDateISO(); // FIX: Usar fecha local
    
    const allEntries = await db.entries.where('dateISO').equals(today).toArray();
    const userProfile = await db.profile.get('user-profile');
    
    setEntries(allEntries);
    setProfile(userProfile || null);
    
    // Cargar nombres de alimentos dinámicamente
    const names: Record<string, string> = {};
    for (const entry of allEntries) {
      for (const item of entry.items) {
        if (item.foodId && !names[item.foodId]) {
          names[item.foodId] = await getFoodDisplayName(item.foodId, item.name);
        }
      }
    }
    setFoodNames(names);
    
    setLoading(false);
  }, [dateParam]);

  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  const handleCheckIn = async (satiety: 'very-hungry' | 'hungry' | 'satisfied' | 'full' | 'very-full') => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      const newEntry: Entry = {
        id: `checkin-${now.getTime()}`,
        dateISO: getTodayDateISO(),
        time: timeStr,
        type: 'checkin',
        items: [],
        wellbeing: {
          hunger: satiety
        }
      };

      await db.entries.add(newEntry);
      
      toast({
        title: 'Guardado',
        description: 'Tu nivel de saciedad ha sido guardado.',
      });
      
      await loadTodayData();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el registro',
        variant: 'destructive',
      });
    }
  };

  const handleUndoCheckIn = async (entryId: string) => {
    try {
      await db.entries.delete(entryId);
      toast({
        title: 'Deshecho',
        description: 'Registro de saciedad eliminado.',
      });
      await loadTodayData();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el registro',
        variant: 'destructive',
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingEntry || !editingEntry.id) return;

    try {
      // Recalculate total calories
      const totalKcal = editingEntry.items.reduce((sum: number, item: EditingItem) => sum + (Number(item.kcal) || 0), 0);
      
      // Clean up internal properties and ensure numbers
      const cleanItems = editingEntry.items.map((item: EditingItem) => {
        const { _kcalPerUnit, ...rest } = item;
        return {
          ...rest,
          qty: Number(item.qty) || 0,
          kcal: Number(item.kcal) || 0,
        };
      });

      const updatedEntry = { ...editingEntry, items: cleanItems, totalKcal } as Entry;

      await db.entries.put(updatedEntry);

      toast({
        title: '✓ Actualizado',
        description: 'Entrada actualizada correctamente',
      });

      setEditingEntry(null);
      await loadTodayData();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la entrada',
        variant: 'destructive',
      });
    }
  };



  const handleDelete = async (entryId: string) => {
    try {
      await db.entries.delete(entryId);
      
      toast({
        title: '✓ Eliminado',
        description: 'Entrada borrada correctamente',
      });
      
      await loadTodayData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la entrada',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog(null);
    }
  };

  const handleDuplicate = async (entry: Entry) => {
    try {
      const now = new Date();
      
      const newEntry: Entry = {
        ...entry,
        id: `entry-${now.getTime()}`,
        dateISO: getTodayDateISO(), // FIX: Usar fecha local
      };
      
      await db.entries.add(newEntry);
      
      toast({
        title: '✓ Duplicado',
        description: 'Entrada duplicada correctamente',
      });
      
      await loadTodayData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo duplicar la entrada',
        variant: 'destructive',
      });
    }
  };

  // Agrupar entradas por tipo de comida
  const groupedEntries = {
    breakfast: entries.filter(e => e.type === 'breakfast'),
    lunch: entries.filter(e => e.type === 'lunch'),
    dinner: entries.filter(e => e.type === 'dinner'),
    snack: entries.filter(e => e.type === 'snack'),
  };

  const totalKcal = entries.reduce((sum, entry) => sum + (entry.totalKcal || 0), 0);
  const targetKcal = profile?.manualKcal || profile?.dailyKcal || 2000;
  const percentage = Math.min((totalKcal / targetKcal) * 100, 100);

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  const CalorieSummary = () => {
    const getTitle = () => {
      const todayISO = getTodayDateISO();
      const currentISO = dateParam || todayISO;
      
      if (currentISO === todayISO) return "Calorías de hoy";
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      if (currentISO === yISO) return "Calorías de ayer";
      
      const [y, m, d] = currentISO.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return `Calorías del ${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
    };

    return (
    <Card className="p-6 bg-gradient-card shadow-elevated border-2 border-primary/20">
      <div className="flex items-center gap-4">
        
        <div className="flex-1 space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{getTitle()}</p>
                {profile && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-primary/10">
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Cálculo de tu objetivo diario</DialogTitle>
                        <DialogDescription>
                          Fórmula Mifflin-St Jeor (1990)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
                            {getCalorieFormulaExplanation(profile, targetKcal)}
                          </pre>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          📚 Referencia: Mifflin MD, St Jeor ST, et al. "A new predictive equation for resting energy expenditure in healthy individuals." Am J Clin Nutr. 1990;51(2):241-7.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <p className="text-3xl font-bold text-foreground">
                {Number(totalKcal.toFixed(1))} <span className="text-xl text-muted-foreground">/ {targetKcal}</span>
              </p>
            </div>
            <Badge variant={totalKcal > targetKcal ? 'destructive' : 'secondary'}>
              {Math.round(percentage)}%
            </Badge>
          </div>
          
          <Progress value={percentage} className="h-2" />
          
          {totalKcal > targetKcal && (
            <p className="text-xs text-destructive">
              +{Number((totalKcal - targetKcal).toFixed(1))} kcal sobre el objetivo
            </p>
          )}
          {totalKcal < targetKcal && targetKcal - totalKcal > 200 && (
            <p className="text-xs text-muted-foreground">
              Quedan {Number((targetKcal - totalKcal).toFixed(1))} kcal para tu objetivo
            </p>
          )}
        </div>
      </div>
    </Card>
  );
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Mobile Widget */}
          <div className="lg:hidden">
             <AtmosphereWidget 
               entries={entries} 
               onCheckIn={handleCheckIn} 
               onUndoCheckIn={handleUndoCheckIn}
               isToday={!dateParam || dateParam === getTodayDateISO()} 
               city={profile?.city}
             />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-foreground">{dateParam ? 'Registro' : 'Hoy'}</h1>
                <Button 
                  size="icon" 
                  className="h-8 w-8 rounded-full shadow-sm" 
                  onClick={() => navigate(dateParam ? `/?date=${dateParam}` : '/')}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-muted-foreground font-serif">
                {new Date(dateParam || new Date()).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            
            {/* Mobile Trigger for Calories */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {Number(totalKcal.toFixed(1))} kcal
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Resumen calórico</SheetTitle>
                  </SheetHeader>
                  <CalorieSummary />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {entries.length === 0 ? (
                <Card className="p-8 text-center bg-gradient-card shadow-card">
                  <p className="text-muted-foreground">
                    {dateParam && dateParam !== getTodayDateISO() 
                      ? `No hay nada registrado el ${new Date(dateParam).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}.`
                      : "Aún no has registrado nada hoy."}
                  </p>
                  {dateParam && dateParam !== getTodayDateISO() ? (
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(`/register?date=${dateParam}`)}
                    >
                      Añadir
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Cuando quieras, ve a "Registrar" para añadir algo.
                    </p>
                  )}
                </Card>
              ) : (
                <div className="space-y-6">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                    const typeEntries = groupedEntries[type];
                    if (typeEntries.length === 0) return null;

                    const Icon = MEAL_ICONS[type];
                    const typeTotalKcal = typeEntries.reduce((sum, e) => sum + (e.totalKcal || 0), 0);

                    return (
                      <div key={type} className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                            <h3 className="font-semibold text-lg">{MEAL_LABELS[type]}</h3>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {Number(typeTotalKcal.toFixed(1))} kcal
                          </Badge>
                        </div>

                        <Card className="divide-y divide-border bg-gradient-card shadow-card overflow-hidden">
                          {typeEntries.map((entry) => (
                            <div key={entry.id} className="p-4 hover:bg-muted/30 transition-colors">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1 flex-1">
                                    {entry.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-foreground">
                                            {item.foodId && foodNames[item.foodId] ? foodNames[item.foodId] : item.name}
                                          </span>
                                          {entry.time && idx === 0 && (
                                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                              {entry.time}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-muted-foreground text-xs">
                                            {item.qty} {item.unit}
                                          </span>
                                          {item.kcal && item.kcal > 0 && (
                                            <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                                              {Number(item.kcal.toFixed(1))} kcal
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => {
                                        const entryToEdit = JSON.parse(JSON.stringify(entry));
                                        // Calculate and store density for each item to allow safe editing
                                        entryToEdit.items = entryToEdit.items.map((item: EntryItem) => ({
                                          ...item,
                                          _kcalPerUnit: (item.kcal && item.qty) ? item.kcal / item.qty : 0
                                        }));
                                        setEditingEntry(entryToEdit);
                                      }}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDuplicate(entry)}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Duplicar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => setDeleteDialog(entry.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {entry.notes && (
                                  <p className="text-xs text-muted-foreground italic pl-2 border-l-2 border-primary/20">
                                    {entry.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bienestar del día - MOVED TO SIDEBAR */}
              <SeasonalWidget 
                date={dateParam ? new Date(dateParam) : new Date()} 
                city={profile?.city}
              />
            </div>

            {/* Sidebar - Calories (Desktop only) */}
            <div className="hidden lg:block space-y-6">
              <div className="sticky top-6 space-y-6">
                <AtmosphereWidget 
                  entries={entries} 
                  onCheckIn={handleCheckIn} 
                  onUndoCheckIn={handleUndoCheckIn}
                  isToday={!dateParam || dateParam === getTodayDateISO()} 
                  city={profile?.city}
                />
                <CalorieSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={editingEntry !== null} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar entrada</DialogTitle>
            <DialogDescription>Modifica los detalles de este registro.</DialogDescription>
          </DialogHeader>
          
          {editingEntry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora</Label>
                  <Input 
                    type="time" 
                    value={editingEntry.time || ''} 
                    onChange={(e) => setEditingEntry({...editingEntry, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingEntry.type}
                    onChange={(e) => setEditingEntry({...editingEntry, type: e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack'})}
                  >
                    <option value="breakfast">Desayuno</option>
                    <option value="lunch">Comida</option>
                    <option value="dinner">Cena</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Alimentos</Label>
                {editingEntry.items.map((item, idx) => (
                  <div key={idx} className="p-3 border rounded-lg space-y-3 bg-muted/20">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Nombre</Label>
                      <Input 
                        value={item.name} 
                        onChange={(e) => {
                          const newItems = [...editingEntry.items];
                          newItems[idx] = { ...item, name: e.target.value };
                          setEditingEntry({ ...editingEntry, items: newItems });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Cantidad</Label>
                        <Input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const newQty = parseFloat(rawValue) || 0;
                            
                            // Use stored density (_kcalPerUnit) if available, otherwise fallback to current ratio
                            // Note: use parseFloat on item.kcal/qty in case they are strings currently
                            const currentKcal = Number(item.kcal) || 0;
                            const currentQty = Number(item.qty) || 0;
                            
                            const density = item._kcalPerUnit !== undefined 
                              ? item._kcalPerUnit 
                              : (currentQty > 0 ? currentKcal / currentQty : 0);
                            
                            const newKcal = Math.round(density * newQty);
                            
                            const newItems = [...editingEntry.items];
                            // Store rawValue to allow empty string input
                            newItems[idx] = { ...item, qty: rawValue, kcal: newKcal } as EditingItem;
                            setEditingEntry({ ...editingEntry, items: newItems });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Unidad</Label>
                        <Input 
                          value={item.unit} 
                          onChange={(e) => {
                            const newItems = [...editingEntry.items];
                            newItems[idx] = { ...item, unit: e.target.value };
                            setEditingEntry({ ...editingEntry, items: newItems });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Kcal</Label>
                        <Input 
                          type="number" 
                          value={item.kcal} 
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const newKcal = parseFloat(rawValue) || 0;
                            const newItems = [...editingEntry.items];
                            
                            // Update density when manually changing kcal
                            const currentQty = Number(item.qty) || 0;
                            const newDensity = currentQty > 0 ? newKcal / currentQty : 0;
                            
                            newItems[idx] = { ...item, kcal: rawValue, _kcalPerUnit: newDensity } as EditingItem;
                            setEditingEntry({ ...editingEntry, items: newItems });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Notas</Label>
                <Input 
                  value={editingEntry.notes || ''} 
                  onChange={(e) => setEditingEntry({...editingEntry, notes: e.target.value})}
                  placeholder="Añadir nota..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingEntry(null)}>Cancelar</Button>
                <Button onClick={handleSaveEdit}>Guardar cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar entrada?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La entrada se eliminará permanentemente de tu dispositivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <BottomNav />
    </>
  );
};

export default Today;
