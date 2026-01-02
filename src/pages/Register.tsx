import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db, FoodItem, Entry } from '@/lib/db';
import { getTodayDateISO } from '@/lib/utils';
import { Info, ExternalLink } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [showNutrition, setShowNutrition] = useState(false);
  
  // Nutrition states
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sugar, setSugar] = useState('');
  const [fiber, setFiber] = useState('');
  const [salt, setSalt] = useState('');
  
  // Suggestions
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Buscar sugerencias
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (name.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const results = await db.foods
          .filter(f => f.name.toLowerCase().includes(name.toLowerCase()))
          .limit(5)
          .toArray();
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [name]);

  const selectSuggestion = (food: FoodItem) => {
    setName(food.name);
    setBrand(food.brand || '');
    setKcal(food.nutritionPer100.kcal.toString());
    setProtein(food.nutritionPer100.protein.toString());
    setFat(food.nutritionPer100.fat.toString());
    setSaturatedFat(food.nutritionPer100.saturatedFat?.toString() || '');
    setCarbs(food.nutritionPer100.carbs.toString());
    setSugar(food.nutritionPer100.sugar?.toString() || '');
    setFiber(food.nutritionPer100.fiber?.toString() || '');
    setSalt(food.nutritionPer100.salt?.toString() || '');
    setShowNutrition(true);
    setShowSuggestions(false);
  };

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
        saturatedFat: saturatedFat ? parseFloat(saturatedFat) : undefined,
        carbs: carbs ? parseFloat(carbs) : 0,
        sugar: sugar ? parseFloat(sugar) : undefined,
        fiber: fiber ? parseFloat(fiber) : 0,
        salt: salt ? parseFloat(salt) : undefined,
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

      const qtyVal = parseFloat(quantity) || 100;
      const ratio = qtyVal / 100;

      const entry: Entry = {
        id: `entry-${Date.now()}`,
        dateISO: dateParam || getTodayDateISO(),
        time: time,
        type: mealType,
        items: [{
          foodId: food.id,
          name: food.name,
          qty: qtyVal,
          unit: 'g',
          kcal: food.nutritionPer100.kcal * ratio,
          protein: food.nutritionPer100.protein * ratio,
          fat: food.nutritionPer100.fat * ratio,
          saturatedFat: food.nutritionPer100.saturatedFat ? food.nutritionPer100.saturatedFat * ratio : undefined,
          carbs: food.nutritionPer100.carbs * ratio,
          sugar: food.nutritionPer100.sugar ? food.nutritionPer100.sugar * ratio : undefined,
          fiber: food.nutritionPer100.fiber ? food.nutritionPer100.fiber * ratio : undefined,
          salt: food.nutritionPer100.salt ? food.nutritionPer100.salt * ratio : undefined,
        }],
        totalKcal: food.nutritionPer100.kcal * ratio,
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
      setSaturatedFat('');
      setCarbs('');
      setSugar('');
      setFiber('');
      setSalt('');
      setShowNutrition(false);
      
      // Opcional: Navegar a "Today" para ver el registro
      navigate(dateParam ? `/today?date=${dateParam}` : '/today'); 

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
            <div className="col-span-3 space-y-2 relative">
              <Label htmlFor="food-name">Nombre del alimento *</Label>
              <Input
                id="food-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => name.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Ej: Huevos revueltos"
                autoFocus
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-popover border rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                  {suggestions.map((food) => (
                    <button
                      key={food.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => selectSuggestion(food)}
                    >
                      <span className="font-medium">{food.name}</span>
                      {food.brand && <span className="text-muted-foreground ml-2 text-xs">({food.brand})</span>}
                    </button>
                  ))}
                </div>
              )}
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

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad consumida (g)</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="100"
            />
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
               <div className="p-3 bg-muted/50 rounded-md border flex justify-between items-center">
                  <span className="text-sm font-medium">Total para {quantity || 0}g:</span>
                  <span className="text-xl font-bold">
                    {((parseFloat(kcal) || 0) * (parseFloat(quantity) || 0) / 100).toFixed(0)} kcal
                  </span>
               </div>

               <div className="space-y-2">
                <Label htmlFor="food-brand">Marca (opcional)</Label>
                <Input
                  id="food-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: La Cocinera"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">
                  Información nutricional (por 100g)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4 text-sm" side="right">
                      <div className="space-y-2">
                        <p className="font-semibold">¿No tienes los datos?</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => window.open('https://es.openfoodfacts.org/', '_blank')}
                          type="button"
                        >
                          Buscar en Open Food Facts
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="border rounded-md divide-y text-sm">
                <div className="grid grid-cols-[2fr_1fr] items-center p-3 bg-muted/30">
                  <Label htmlFor="kcal" className="font-semibold truncate leading-relaxed">Valor Energético (kcal) *</Label>
                  <Input
                    id="kcal"
                    type="number"
                    step="0.1"
                    value={kcal}
                    onChange={(e) => setKcal(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3">
                  <Label htmlFor="fat" className="font-medium truncate leading-relaxed">Grasas (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3 pl-6 bg-muted/10">
                  <Label htmlFor="saturatedFat" className="text-muted-foreground font-normal truncate leading-relaxed">de las cuales saturadas (g)</Label>
                  <Input
                    id="saturatedFat"
                    type="number"
                    step="0.1"
                    value={saturatedFat}
                    onChange={(e) => setSaturatedFat(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3">
                  <Label htmlFor="carbs" className="font-medium truncate leading-relaxed">Hidratos de carbono (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3 pl-6 bg-muted/10">
                  <Label htmlFor="sugar" className="text-muted-foreground font-normal truncate leading-relaxed">de los cuales azúcares (g)</Label>
                  <Input
                    id="sugar"
                    type="number"
                    step="0.1"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3">
                  <Label htmlFor="fiber" className="font-medium truncate leading-relaxed">Fibra alimentaria (g)</Label>
                  <Input
                    id="fiber"
                    type="number"
                    step="0.1"
                    value={fiber}
                    onChange={(e) => setFiber(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3">
                  <Label htmlFor="protein" className="font-medium truncate leading-relaxed">Proteínas (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-[2fr_1fr] items-center p-3">
                  <Label htmlFor="salt" className="font-medium truncate leading-relaxed">Sal (g)</Label>
                  <Input
                    id="salt"
                    type="number"
                    step="0.01"
                    value={salt}
                    onChange={(e) => setSalt(e.target.value)}
                    placeholder="0"
                    className="h-8 text-right border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
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
