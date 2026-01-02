import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { extractNutritionFromText } from '@/lib/parser';
import { FoodItem, db } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, ExternalLink, Info } from 'lucide-react';

interface CreateFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
  onFoodCreated?: (food: FoodItem) => void;
}

const CreateFoodDialog = ({
  open,
  onOpenChange,
  defaultName = '',
  onFoodCreated,
}: CreateFoodDialogProps) => {
  const [name, setName] = useState(defaultName);
  const [brand, setBrand] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sugar, setSugar] = useState('');
  const [fiber, setFiber] = useState('');
  const [salt, setSalt] = useState('');
  const [nutritionText, setNutritionText] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  // Actualizar el nombre cuando cambia defaultName (autorrellenado)
  useEffect(() => {
    if (defaultName) {
      setName(defaultName);
    }
  }, [defaultName]);

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

  const handleExtract = () => {
    const extracted = extractNutritionFromText(nutritionText);
    
    if (extracted.kcal) setKcal(extracted.kcal.toString());
    if (extracted.protein) setProtein(extracted.protein.toString());
    if (extracted.fat) setFat(extracted.fat.toString());
    if (extracted.saturatedFat) setSaturatedFat(extracted.saturatedFat.toString());
    if (extracted.carbs) setCarbs(extracted.carbs.toString());
    if (extracted.sugar) setSugar(extracted.sugar.toString());
    if (extracted.fiber) setFiber(extracted.fiber.toString());
    if (extracted.salt) setSalt(extracted.salt.toString());
    
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
      
      toast({
        title: '✓ Alimento creado',
        description: `${name}${brand ? ` (${brand})` : ''} guardado en tu base de datos`,
      });
      
      onFoodCreated?.(food);
      onOpenChange(false);
      
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
      setNutritionText('');
      setShowNutrition(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el alimento',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Crear alimento nuevo</DialogTitle>
          <DialogDescription className="space-y-3">
            <span className="block">
              Añade un alimento a tu base de datos personal. Valores por 100g.
            </span>
            
            
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 overflow-y-auto flex-1">
          <div className="space-y-4 pb-4">
          <div className="space-y-2 relative">
            <Label htmlFor="food-name">Nombre del alimento *</Label>
            <Input
              id="food-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => name.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ej: Huevos revueltos"
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
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="food-brand">Marca (opcional)</Label>
                <Input
                  id="food-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: La Huerta"
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
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Consejo: Si tienes el código de barras del producto, búscalo
                      directamente en Open Food Facts para obtener datos exactos.
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
              <Label htmlFor="kcal">Valor Energético (kcal) *</Label>
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

            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="saturatedFat" className="text-xs text-muted-foreground">de las cuales saturadas (g)</Label>
              <Input
                id="saturatedFat"
                type="number"
                step="0.1"
                value={saturatedFat}
                onChange={(e) => setSaturatedFat(e.target.value)}
                placeholder="12.0"
                className="h-8 text-sm"
              />
            </div>
            
            <div className="col-span-1"></div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Hidratos de carbono (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="41.2"
              />
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="sugar" className="text-xs text-muted-foreground">de los cuales azúcares (g)</Label>
              <Input
                id="sugar"
                type="number"
                step="0.1"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                placeholder="17.2"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiber">Fibra alimentaria (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                placeholder="1.9"
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
              <Label htmlFor="salt">Sal (g)</Label>
              <Input
                id="salt"
                type="number"
                step="0.01"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="1.2"
              />
            </div>
          </div>
          </div>
          )}

          {kcal && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                Vista previa: <span className="font-medium text-foreground">100g = {kcal} kcal</span>
              </p>
            </div>
          )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar alimento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFoodDialog;
