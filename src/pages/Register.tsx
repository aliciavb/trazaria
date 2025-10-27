import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, Entry, UserEquivalence, FoodItem } from '@/lib/db';
import { Save, Plus, X, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateFoodDialog from '@/components/CreateFoodDialog';
import BottomNav from '@/components/BottomNav';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Comida' },
  { value: 'dinner', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
];

const COMMON_UNITS = [
  { value: 'g', label: 'gramos (g)' },
  { value: 'ml', label: 'mililitros (ml)' },
  { value: 'taza', label: 'taza' },
  { value: 'bol', label: 'bol' },
  { value: 'puñado', label: 'puñado' },
  { value: 'cucharada', label: 'cucharada' },
  { value: 'unidad', label: 'unidad' },
];

interface ItemInput {
  id: string;
  name: string;
  qty: string;
  unit: string;
  foodId?: string;
  kcal?: number;
  isUnknown?: boolean;
}

const Register = () => {
  const [items, setItems] = useState<ItemInput[]>([
    { id: '1', name: '', qty: '', unit: 'g' },
  ]);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [equivalences, setEquivalences] = useState<UserEquivalence[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [createFoodDialog, setCreateFoodDialog] = useState(false);
  const [createFoodName, setCreateFoodName] = useState('');
  const [suggestions, setSuggestions] = useState<{ [key: string]: FoodItem[] }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allFoods = await db.foods.toArray();
    const allEquiv = await db.equivalences.toArray();
    setFoods(allFoods);
    setEquivalences(allEquiv);
  };

  const handleNameChange = (id: string, name: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // Search for matching foods
        const matches = foods.filter(f => 
          f.name.toLowerCase().includes(name.toLowerCase())
        ).slice(0, 5);
        
        setSuggestions(prev => ({ ...prev, [id]: matches }));
        
        return { ...item, name, foodId: undefined, kcal: undefined };
      }
      return item;
    }));
  };

  const handleSelectFood = (itemId: string, food: FoodItem) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        setSuggestions(prev => ({ ...prev, [itemId]: [] }));
        return {
          ...item,
          name: `${food.name}${food.brand ? ` (${food.brand})` : ''}`,
          foodId: food.id,
          isUnknown: false,
        };
      }
      return item;
    }));
  };

  const handleQtyChange = (id: string, qty: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty } : item
    ));
  };

  const handleUnitChange = (id: string, unit: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, unit } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', qty: '', unit: 'g' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateItemKcal = (item: ItemInput): number => {
    if (!item.foodId || !item.qty) return 0;
    
    const food = foods.find(f => f.id === item.foodId);
    if (!food) return 0;

    let grams = parseFloat(item.qty);
    
    // Convert to grams using equivalences if needed
    if (item.unit !== 'g') {
      const equiv = equivalences.find(e => 
        e.unitLabel.toLowerCase() === item.unit.toLowerCase()
      );
      if (equiv) {
        grams = grams * equiv.gramsPerUnit;
      } else {
        // Default conversions for common units
        if (item.unit === 'ml') grams = grams; // 1ml ≈ 1g for most liquids
        if (item.unit === 'taza') grams = grams * 240;
        if (item.unit === 'bol') grams = grams * 300;
        if (item.unit === 'cucharada') grams = grams * 15;
      }
    }

    return Math.round((grams / 100) * food.nutritionPer100.kcal);
  };

  const handleSave = async () => {
    // Validate
    const validItems = items.filter(item => item.name.trim() && item.qty);
    
    if (validItems.length === 0) {
      toast({
        title: 'No hay items',
        description: 'Añade al menos un alimento',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedMeal) {
      toast({
        title: 'Falta tipo de comida',
        description: 'Selecciona desayuno, comida, cena o snack',
        variant: 'destructive',
      });
      return;
    }

    // Check for unknown items
    const unknownItems = validItems.filter(item => !item.foodId);
    if (unknownItems.length > 0) {
      toast({
        title: 'Alimentos desconocidos',
        description: `${unknownItems.length} alimento(s) no están en la base de datos. Créalos primero.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date();
      
      const itemsWithCalories = validItems.map(item => ({
        name: item.name,
        qty: parseFloat(item.qty),
        unit: item.unit,
        kcal: calculateItemKcal(item),
      }));

      const totalKcal = itemsWithCalories.reduce((sum, item) => sum + item.kcal, 0);
      
      const entry: Entry = {
        id: `entry-${now.getTime()}`,
        dateISO: now.toISOString().split('T')[0],
        type: selectedMeal as any,
        items: itemsWithCalories,
        totalKcal,
      };

      await db.entries.add(entry);
      
      toast({
        title: '✓ Guardado',
        description: `${itemsWithCalories.length} items • ${totalKcal} kcal`,
      });

      // Reset form
      setItems([{ id: '1', name: '', qty: '', unit: 'g' }]);
      setSelectedMeal('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la entrada',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateFood = (itemId: string, itemName: string) => {
    // Si el campo está vacío, abrir el diálogo vacío
    if (!itemName.trim()) {
      setCreateFoodName('');
      setCreateFoodDialog(true);
      return;
    }
    
    // Validar si ya existe un alimento con ese nombre exacto
    const normalized = itemName.trim().toLowerCase();
    const existing = foods.find(f => {
      const foodName = f.brand 
        ? `${f.name} (${f.brand})`.toLowerCase()
        : f.name.toLowerCase();
      return foodName === normalized;
    });
    
    if (existing) {
      toast({
        title: 'Ya existe en tu base de datos',
        description: 'Este alimento ya está registrado. Selecciónalo del dropdown o edítalo desde la página Base de Datos.',
        variant: 'destructive',
      });
      return;
    }
    
    setCreateFoodName(itemName);
    setCreateFoodDialog(true);
  };

  const handleFoodCreated = (food: FoodItem) => {
    setFoods([...foods, food]);
    // Auto-select the newly created food for the item that triggered creation
    const displayName = `${food.name}${food.brand ? ` (${food.brand})` : ''}`;
    const itemWithName = items.find(item => 
      item.name.toLowerCase().includes(food.name.toLowerCase())
    );
    if (itemWithName) {
      handleSelectFood(itemWithName.id, food);
    }
  };

  const getItemPreview = (item: ItemInput): string => {
    if (!item.qty || !item.foodId) return '';
    const kcal = calculateItemKcal(item);
    return kcal > 0 ? `≈ ${kcal} kcal` : '';
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Registrar</h1>
            <p className="text-muted-foreground">
              Añade lo que has comido, si quieres
            </p>
          </div>

          <Card className="p-6 space-y-4 bg-gradient-card shadow-card">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="space-y-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Item {index + 1}
                    </Label>
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`name-${item.id}`}>Alimento</Label>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`name-${item.id}`}
                          value={item.name}
                          onChange={(e) => handleNameChange(item.id, e.target.value)}
                          placeholder="Ej: yogur griego, avena, manzana..."
                          autoComplete="off"
                        />
                        
                        {suggestions[item.id] && suggestions[item.id].length > 0 && (
                          <Card className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto shadow-elevated">
                            {suggestions[item.id].map(food => (
                              <button
                                key={food.id}
                                onClick={() => handleSelectFood(item.id, food)}
                                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors border-b border-border last:border-0"
                              >
                                <p className="text-sm font-medium">
                                  {food.name}{food.brand ? ` (${food.brand})` : ''}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {food.nutritionPer100.kcal} kcal/100g
                                </p>
                              </button>
                            ))}
                          </Card>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateFood(item.id, item.name)}
                        className="h-10 flex-shrink-0"
                        title="Crear alimento nuevo"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`qty-${item.id}`}>Cantidad</Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        step="0.1"
                        value={item.qty}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        placeholder="125"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`unit-${item.id}`}>Unidad</Label>
                      <Select value={item.unit} onValueChange={(val) => handleUnitChange(item.id, val)}>
                        <SelectTrigger id={`unit-${item.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_UNITS.map(unit => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {item.foodId && item.qty && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-xs text-muted-foreground">Calorías estimadas:</span>
                      <Badge variant="secondary">{getItemPreview(item)}</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={addItem}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir otro item
            </Button>
          </Card>

          {items.some(item => item.name && item.qty) && (
            <Card className="p-6 space-y-4 bg-gradient-card shadow-elevated">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tipo de comida:</Label>
                <div className="flex gap-2 flex-wrap">
                  {MEAL_TYPES.map((type) => (
                    <Badge
                      key={type.value}
                      variant={selectedMeal === type.value ? 'default' : 'outline'}
                      className="cursor-pointer px-4 py-2"
                      onClick={() => setSelectedMeal(type.value)}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={!selectedMeal || isSaving}
                className="w-full bg-gradient-warm"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </Card>
          )}

          <div className="text-center text-sm text-muted-foreground pt-8 space-y-1">
            <p>🔒 Tus datos se quedan aquí.</p>
            <p>Puedes exportarlos o borrarlos cuando quieras.</p>
          </div>
        </div>
      </div>

      <CreateFoodDialog
        open={createFoodDialog}
        onOpenChange={setCreateFoodDialog}
        defaultName={createFoodName}
        onFoodCreated={handleFoodCreated}
      />
      
      <BottomNav />
    </>
  );
};

export default Register;
