import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db, FoodItem, Entry } from '@/lib/db';
import { getTodayDateISO } from '@/lib/utils';
import { Sparkles, Info, ExternalLink } from 'lucide-react';
import { extractNutritionFromText } from '@/lib/parser';
import BottomNav from '@/components/BottomNav';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [showNutrition, setShowNutrition] = useState(false);
  
  // Nutrition states
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sugar, setSugar] = useState('');
  const [fiber, setFiber] = useState('');
  const [nutritionText, setNutritionText] = useState('');

  const adjustTime = (minutes: number) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m + minutes);
    setTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);
  };

  const setNow = () => {
    const now = new Date();
    setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  };

  const handleTimeBlur = () => {
    const clean = time.replace(/[^0-9]/g, '');
    if (clean.length === 4) {
      const h = clean.slice(0, 2);
      const m = clean.slice(2);
      if (parseInt(h) < 24 && parseInt(m) < 60) {
        setTime(`${h}:${m}`);
      }
    } else if (clean.length === 3) {
      const h = clean.slice(0, 1);
      const m = clean.slice(1);
      setTime(`0${h}:${m}`);
    }
  };

  const handleExtract = () => {
    const extracted = extractNutritionFromText(nutritionText);
    
    if (extracted.kcal) setKcal(extracted.kcal.toString());
    if (extracted.protein) setProtein(extracted.protein.toString());
    if (extracted.fat) setFat(extracted.fat.toString());
    if (extracted.carbs) setCarbs(extracted.carbs.toString());
    if (extracted.sugar) setSugar(extracted.sugar.toString());
    if (extracted.fiber) setFiber(extracted.fiber.toString());
    
    const foundCount = Object.values(extracted).filter(v => v !== undefined).length;
    
    if (foundCount === 0) {
      toast({
        title: 'No se encontró información',
        description: 'Intenta pegar el texto completo de la etiqueta nutricional',
        variant: 'destructive',
      });
    } else {
      toast({
        title: `✓ Extraído`,
        description: `${foundCount} valores nutricionales detectados`,
      });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Faltan datos',
        description: 'Necesitas ponerle un nombre al alimento',
        variant: 'destructive',
      });
      return;
    }

    // 1. Crear el alimento en la base de datos
    const food: FoodItem = {
      id: `food-custom-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || undefined,
      category: 'Otros',
      defaultUnits: ['g'],
      source: 'custom',
      nutritionPer100: {
        kcal: kcal ? parseFloat(kcal) : 0,
        protein: protein ? parseFloat(protein) : 0,
        fat: fat ? parseFloat(fat) : 0,
        carbs: carbs ? parseFloat(carbs) : 0,
        sugar: sugar ? parseFloat(sugar) : undefined,
        fiber: fiber ? parseFloat(fiber) : 0,
      },
    };

    try {
      await db.foods.add(food);

      // 2. Registrar automáticamente en el diario de hoy
      const [hours] = time.split(':').map(Number);
      const hour = hours;
      
      let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack';
      
      if (hour >= 5 && hour < 12) mealType = 'breakfast';
      else if (hour >= 12 && hour < 17) mealType = 'lunch';
      else if (hour >= 17 && hour < 21) mealType = 'snack';
      else mealType = 'dinner';

      const entry: Entry = {
        id: `entry-${Date.now()}`,
        dateISO: getTodayDateISO(),
        time: time,
        type: mealType,
        items: [{
          name: food.name,
          qty: 100, // Por defecto 100g si no se especifica
          unit: 'g',
          kcal: food.nutritionPer100.kcal,
        }],
        totalKcal: food.nutritionPer100.kcal,
      };

      await db.entries.add(entry);
      
      toast({
        title: '✓ Guardado',
        description: `${name} añadido a tu diario`,
      });
      
      // Reset form
      setName('');
      setBrand('');
      setKcal('');
      setProtein('');
      setFat('');
      setCarbs('');
      setSugar('');
      setFiber('');
      setNutritionText('');
      setShowNutrition(false);
      
      // Opcional: Navegar a "Today" para ver el registro
      navigate('/today'); 

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold">Crear alimento nuevo</h1>
          <p className="text-muted-foreground font-serif italic">
            Añade un alimento a tu base de datos personal. Valores por 100g.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label htmlFor="food-name">Nombre del alimento *</Label>
              <Input
                id="food-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Bizcocho chocolate"
                autoFocus
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label htmlFor="food-time">Hora</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full px-2 font-normal text-center"
                  >
                    {time}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Editar hora</Label>
                      <Clock className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <Input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      onBlur={handleTimeBlur}
                      className="text-center text-2xl font-mono tracking-widest h-12"
                      maxLength={5}
                      placeholder="HH:MM"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="secondary" onClick={setNow} className="col-span-2">
                        Ahora
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => adjustTime(-15)}>
                        -15 min
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => adjustTime(-30)}>
                        -30 min
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => adjustTime(-60)}>
                        -1 h
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => adjustTime(-120)}>
                        -2 h
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {!showNutrition ? (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setShowNutrition(true)}
            >
              + Añadir valores nutricionales
            </Button>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border rounded-lg p-4 bg-card">
               <div className="space-y-2">
                <Label htmlFor="food-brand">Marca (opcional)</Label>
                <Input
                  id="food-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: Mercadona"
                />
              </div>

              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => window.open('https://es.openfoodfacts.org/', '_blank')}
                    type="button"
                  >
                    <Info className="w-4 h-4" />
                    ¿No tienes los datos? Buscar en Open Food Facts
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4 text-sm" side="bottom">
                  <div className="space-y-2">
                    <p className="font-semibold">¿Qué es Open Food Facts?</p>
                    <p>
                      Base de datos colaborativa mundial con más de 3 millones de productos.
                      Proyecto open source mantenido por voluntarios.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Pegar info</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="nutrition-text">
                  Información nutricional (por 100g)
                </Label>
                <Textarea
                  id="nutrition-text"
                  value={nutritionText}
                  onChange={(e) => setNutritionText(e.target.value)}
                  placeholder="Pega aquí la info nutricional del paquete&#10;Ej: Valor energético: 488 kcal. Grasas: 33,5 g. Proteínas: 4,5 g..."
                  className="min-h-[120px] text-sm"
                />
              </div>
              
              <Button
                onClick={handleExtract}
                variant="secondary"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Extraer valores
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Introduce los valores manualmente (por 100g)
              </p>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="kcal">Calorías (kcal) *</Label>
              <Input
                id="kcal"
                type="number"
                step="0.1"
                value={kcal}
                onChange={(e) => setKcal(e.target.value)}
                placeholder="488"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Proteínas (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="4.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Grasas (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="33.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Hidratos (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="41.2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sugar">Azúcares (g)</Label>
              <Input
                id="sugar"
                type="number"
                step="0.1"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                placeholder="17.2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiber">Fibra (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                placeholder="1.9"
              />
            </div>
          </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setName('');
                setShowNutrition(false);
                navigate(-1);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar alimento
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Register;
