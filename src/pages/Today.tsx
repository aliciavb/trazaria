import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
import { Apple, Coffee, Sunset, Cookie, Flame, MoreVertical, Trash2, Copy, Info, Smile, Meh, Frown, SmilePlus, Pizza } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';

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
  const [entries, setEntries] = useState<Entry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [foodNames, setFoodNames] = useState<Record<string, string>>({});
  const [dayHunger, setDayHunger] = useState<'very-hungry' | 'hungry' | 'satisfied' | 'full' | 'very-full' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    const today = new Date().toISOString().split('T')[0];
    
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
        dateISO: now.toISOString().split('T')[0],
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

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Hoy</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <Card className="p-6 bg-gradient-card shadow-elevated border-2 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center">
                <Flame className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Calorías de hoy</p>
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
                      {totalKcal} <span className="text-xl text-muted-foreground">/ {targetKcal}</span>
                    </p>
                  </div>
                  <Badge variant={totalKcal > targetKcal ? 'destructive' : 'secondary'}>
                    {Math.round(percentage)}%
                  </Badge>
                </div>
                
                <Progress value={percentage} className="h-2" />
                
                {totalKcal > targetKcal && (
                  <p className="text-xs text-destructive">
                    +{totalKcal - targetKcal} kcal sobre el objetivo
                  </p>
                )}
                {totalKcal < targetKcal && targetKcal - totalKcal > 200 && (
                  <p className="text-xs text-muted-foreground">
                    Quedan {targetKcal - totalKcal} kcal para tu objetivo
                  </p>
                )}
              </div>
            </div>
          </Card>

          {entries.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-card shadow-card">
              <p className="text-muted-foreground">
                Aún no has registrado nada hoy.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Cuando quieras, ve a "Registrar" para añadir algo.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const Icon = MEAL_ICONS[entry.type];
                return (
                  <Card
                    key={entry.id}
                    className="p-5 bg-gradient-card shadow-card hover:shadow-elevated transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {Icon && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">
                            {MEAL_LABELS[entry.type]}
                          </h3>
                          <div className="flex gap-2 items-center">
                            {entry.totalKcal && entry.totalKcal > 0 && (
                              <Badge variant="default" className="bg-gradient-warm">
                                {entry.totalKcal} kcal
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              {entry.items.length} items
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
                        </div>

                        <div className="space-y-2">
                          {entry.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-foreground">
                                {item.foodId && foodNames[item.foodId] ? foodNames[item.foodId] : item.name}
                              </span>
                              <div className="flex gap-2 items-center">
                                <span className="text-muted-foreground">
                                  {item.qty} {item.unit}
                                </span>
                                {item.kcal && item.kcal > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    ({item.kcal} kcal)
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {entry.notes && (
                          <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Bienestar del día */}
          {entries.length > 0 && (
            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">¿Cómo te has sentido hoy?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nivel de saciedad después de tus comidas
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <Button
                    variant={dayHunger === 'very-hungry' ? 'default' : 'outline'}
                    className="flex-col h-auto py-3 px-2"
                    onClick={() => setDayHunger('very-hungry')}
                  >
                    <Frown className="w-6 h-6 mb-1" />
                    <span className="text-xs">Mucha hambre</span>
                  </Button>

                  <Button
                    variant={dayHunger === 'hungry' ? 'default' : 'outline'}
                    className="flex-col h-auto py-3 px-2"
                    onClick={() => setDayHunger('hungry')}
                  >
                    <Meh className="w-6 h-6 mb-1" />
                    <span className="text-xs">Algo de hambre</span>
                  </Button>

                  <Button
                    variant={dayHunger === 'satisfied' ? 'default' : 'outline'}
                    className="flex-col h-auto py-3 px-2"
                    onClick={() => setDayHunger('satisfied')}
                  >
                    <Smile className="w-6 h-6 mb-1" />
                    <span className="text-xs">Saciado</span>
                  </Button>

                  <Button
                    variant={dayHunger === 'full' ? 'default' : 'outline'}
                    className="flex-col h-auto py-3 px-2"
                    onClick={() => setDayHunger('full')}
                  >
                    <SmilePlus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Lleno</span>
                  </Button>

                  <Button
                    variant={dayHunger === 'very-full' ? 'default' : 'outline'}
                    className="flex-col h-auto py-3 px-2"
                    onClick={() => setDayHunger('very-full')}
                  >
                    <Pizza className="w-6 h-6 mb-1" />
                    <span className="text-xs">Muy lleno</span>
                  </Button>
                </div>

                {dayHunger && (
                  <p className="text-xs text-center text-muted-foreground">
                    ✓ Guardado automáticamente
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      
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
