import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFoods, useEquivalences } from '@/hooks/use-database';
import { db, FoodItem, UserEquivalence } from '@/lib/db';
import { 
  Database as DatabaseIcon, 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Download, 
  Upload,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  'Lácteos',
  'Cereales',
  'Frutas',
  'Verduras',
  'Carnes',
  'Pescados',
  'Legumbres',
  'Grasas',
  'Snacks',
  'Acompañamientos',
  'Bebidas',
  'Otros'
];

const Database = () => {
  const { foods } = useFoods();
  const { equivalences } = useEquivalences();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Food dialog
  const [foodDialog, setFoodDialog] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foodForm, setFoodForm] = useState<Partial<FoodItem>>({
    name: '',
    brand: '',
    category: 'Otros',
    source: 'custom',
    defaultUnits: ['g'],
    nutritionPer100: {
      kcal: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
      salt: 0,
    }
  });

  // Equivalence dialog
  const [equivDialog, setEquivDialog] = useState(false);
  const [editingEquiv, setEditingEquiv] = useState<UserEquivalence | null>(null);
  const [equivForm, setEquivForm] = useState<Partial<UserEquivalence>>({
    name: '',
    unitLabel: '',
    gramsPerUnit: 0,
    notes: '',
  });

  // Delete dialogs
  const [deleteFood, setDeleteFood] = useState<FoodItem | null>(null);
  const [deleteEquiv, setDeleteEquiv] = useState<UserEquivalence | null>(null);

  // Export/Import
  const [importDialog, setImportDialog] = useState(false);

  // Filter foods
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Food CRUD operations
  const handleSaveFood = async () => {
    try {
      if (editingFood) {
        // Update
        await db.foods.put({ ...editingFood, ...foodForm } as FoodItem);
        toast({ title: '✓ Actualizado', description: 'Alimento actualizado correctamente' });
      } else {
        // Create
        const newFood: FoodItem = {
          id: `food-${Date.now()}`,
          name: foodForm.name || '',
          brand: foodForm.brand,
          category: foodForm.category || 'Otros',
          source: 'custom',
          defaultUnits: foodForm.defaultUnits || ['g'],
          nutritionPer100: foodForm.nutritionPer100 || {
            kcal: 0,
            carbs: 0,
            fat: 0,
            protein: 0,
          },
          lastUsedAt: new Date().toISOString(),
        };
        await db.foods.add(newFood);
        toast({ title: '✓ Creado', description: 'Alimento añadido a tu base de datos' });
      }
      
      setFoodDialog(false);
      setEditingFood(null);
      resetFoodForm();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudo guardar el alimento',
        variant: 'destructive'
      });
    }
  };

  const handleDuplicateFood = async (food: FoodItem) => {
    const newFood: FoodItem = {
      ...food,
      id: `food-${Date.now()}`,
      name: `${food.name} (copia)`,
      lastUsedAt: new Date().toISOString(),
    };
    await db.foods.add(newFood);
    toast({ title: '✓ Duplicado', description: 'Alimento duplicado correctamente' });
  };

  const handleDeleteFood = async () => {
    if (!deleteFood) return;
    try {
      await db.foods.delete(deleteFood.id!);
      toast({ title: '✓ Eliminado', description: 'Alimento borrado de tu base de datos' });
      setDeleteFood(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudo eliminar el alimento',
        variant: 'destructive'
      });
    }
  };

  // Equivalence CRUD
  const handleSaveEquiv = async () => {
    try {
      if (editingEquiv) {
        await db.equivalences.put({ ...editingEquiv, ...equivForm } as UserEquivalence);
        toast({ title: '✓ Actualizado', description: 'Equivalencia actualizada' });
      } else {
        const newEquiv: UserEquivalence = {
          id: `equiv-${Date.now()}`,
          name: equivForm.name || '',
          unitLabel: equivForm.unitLabel || '',
          gramsPerUnit: equivForm.gramsPerUnit || 0,
          notes: equivForm.notes,
        };
        await db.equivalences.add(newEquiv);
        toast({ title: '✓ Creado', description: 'Equivalencia añadida' });
      }
      
      setEquivDialog(false);
      setEditingEquiv(null);
      resetEquivForm();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudo guardar la equivalencia',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteEquiv = async () => {
    if (!deleteEquiv) return;
    try {
      await db.equivalences.delete(deleteEquiv.id!);
      toast({ title: '✓ Eliminado', description: 'Equivalencia eliminada' });
      setDeleteEquiv(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudo eliminar la equivalencia',
        variant: 'destructive'
      });
    }
  };

  // Export/Import
  const handleExport = async () => {
    const allFoods = await db.foods.toArray();
    const allEquivs = await db.equivalences.toArray();
    const profile = await db.profile.get('user-profile');
    const entries = await db.entries.toArray();

    const exportData = {
      version: '0.5.0',
      exportDate: new Date().toISOString(),
      foods: allFoods,
      equivalences: allEquivs,
      profile,
      entries,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trazaria-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ 
      title: '✓ Exportado', 
      description: 'Copia de seguridad descargada correctamente' 
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Import foods
      if (data.foods && Array.isArray(data.foods)) {
        await db.foods.bulkPut(data.foods);
      }

      // Import equivalences
      if (data.equivalences && Array.isArray(data.equivalences)) {
        await db.equivalences.bulkPut(data.equivalences);
      }

      setImportDialog(false);

      toast({ 
        title: '✓ Importado', 
        description: 'Datos restaurados correctamente' 
      });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Archivo inválido o corrupto',
        variant: 'destructive'
      });
    }
  };

  const resetFoodForm = () => {
    setFoodForm({
      name: '',
      brand: '',
      category: 'Otros',
      source: 'custom',
      defaultUnits: ['g'],
      nutritionPer100: {
        kcal: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        fiber: 0,
        sugar: 0,
        salt: 0,
      }
    });
  };

  const resetEquivForm = () => {
    setEquivForm({
      name: '',
      unitLabel: '',
      gramsPerUnit: 0,
      notes: '',
    });
  };

  const openEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setFoodForm(food);
    setFoodDialog(true);
  };

  const openCreateFood = () => {
    setEditingFood(null);
    resetFoodForm();
    setFoodDialog(true);
  };

  const openEditEquiv = (equiv: UserEquivalence) => {
    setEditingEquiv(equiv);
    setEquivForm(equiv);
    setEquivDialog(true);
  };

  const openCreateEquiv = () => {
    setEditingEquiv(null);
    resetEquivForm();
    setEquivDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-warm mb-2">
              <DatabaseIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Base de datos</h1>
            <p className="text-muted-foreground">
              Tu biblioteca personal de alimentos y equivalencias
            </p>
          </div>

          <Tabs defaultValue="foods" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="foods">Alimentos</TabsTrigger>
              <TabsTrigger value="equivalences">Equivalencias</TabsTrigger>
              <TabsTrigger value="export">Exportar/Importar</TabsTrigger>
            </TabsList>

            {/* ALIMENTOS TAB */}
            <TabsContent value="foods" className="space-y-4">
              <Card className="p-4 bg-gradient-card">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar alimento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={openCreateFood} className="bg-gradient-warm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo alimento
                  </Button>
                </div>
              </Card>

              <div className="grid gap-3">
                {filteredFoods.length === 0 ? (
                  <Card className="p-8 text-center bg-gradient-card">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No se encontraron alimentos
                    </p>
                  </Card>
                ) : (
                  filteredFoods.map((food) => (
                    <Card key={food.id} className="p-4 bg-gradient-card hover:shadow-elevated transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">{food.name}</h3>
                              {food.brand && (
                                <p className="text-sm text-muted-foreground">{food.brand}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditFood(food)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDuplicateFood(food)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteFood(food)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{food.category}</Badge>
                            <Badge variant="outline">{food.source}</Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-sm pt-2">
                            <div>
                              <p className="text-muted-foreground text-xs">Kcal</p>
                              <p className="font-semibold">{food.nutritionPer100.kcal}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Proteína</p>
                              <p className="font-semibold">{food.nutritionPer100.protein}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Carbohidratos</p>
                              <p className="font-semibold">{food.nutritionPer100.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Grasas</p>
                              <p className="font-semibold">{food.nutritionPer100.fat}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* EQUIVALENCIAS TAB */}
            <TabsContent value="equivalences" className="space-y-4">
              <Card className="p-4 bg-gradient-card">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Define equivalencias para facilitar el registro
                  </p>
                  <Button onClick={openCreateEquiv} className="bg-gradient-warm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva equivalencia
                  </Button>
                </div>
              </Card>

              <div className="grid gap-3">
                {equivalences.length === 0 ? (
                  <Card className="p-8 text-center bg-gradient-card">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No hay equivalencias definidas
                    </p>
                  </Card>
                ) : (
                  equivalences.map((equiv) => (
                    <Card key={equiv.id} className="p-4 bg-gradient-card hover:shadow-elevated transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{equiv.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            1 {equiv.unitLabel} = {equiv.gramsPerUnit}g
                          </p>
                          {equiv.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{equiv.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditEquiv(equiv)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteEquiv(equiv)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* EXPORT/IMPORT TAB */}
            <TabsContent value="export" className="space-y-4">
              <Card className="p-6 bg-gradient-card space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Exportar datos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Descarga una copia de seguridad de todos tus datos: alimentos, comidas, equivalencias y configuración.
                  </p>
                  <Button onClick={handleExport} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar copia de seguridad (.json)
                  </Button>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Importar datos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Restaura una copia de seguridad previa. Esto combinará los datos importados con los existentes.
                  </p>
                  <Button onClick={() => setImportDialog(true)} className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar desde archivo
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card border-primary/20">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Tus datos son tuyos</h3>
                    <p className="text-sm text-muted-foreground">
                      Todo se almacena localmente en tu dispositivo. Puedes exportar, importar o eliminar tus datos cuando quieras. Trazaria no tiene acceso a ellos.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FOOD DIALOG */}
      <Dialog open={foodDialog} onOpenChange={setFoodDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              {editingFood ? 'Editar alimento' : 'Nuevo alimento'}
            </DialogTitle>
            <DialogDescription>
              Valores nutricionales por 100g o 100ml
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 overflow-y-auto flex-1">
            <div className="grid gap-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  placeholder="Ej: Yogur griego"
                />
              </div>
              <div className="space-y-2">
                <Label>Marca (opcional)</Label>
                <Input
                  value={foodForm.brand || ''}
                  onChange={(e) => setFoodForm({ ...foodForm, brand: e.target.value })}
                  placeholder="Ej: Danone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select 
                value={foodForm.category} 
                onValueChange={(val) => setFoodForm({ ...foodForm, category: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Valores nutricionales (por 100g/ml)</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Calorías (kcal) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={foodForm.nutritionPer100?.kcal || ''}
                    onChange={(e) => setFoodForm({
                      ...foodForm,
                      nutritionPer100: {
                        ...foodForm.nutritionPer100!,
                        kcal: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Proteína (g) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={foodForm.nutritionPer100?.protein || ''}
                    onChange={(e) => setFoodForm({
                      ...foodForm,
                      nutritionPer100: {
                        ...foodForm.nutritionPer100!,
                        protein: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carbohidratos (g) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={foodForm.nutritionPer100?.carbs || ''}
                    onChange={(e) => setFoodForm({
                      ...foodForm,
                      nutritionPer100: {
                        ...foodForm.nutritionPer100!,
                        carbs: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grasas (g) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={foodForm.nutritionPer100?.fat || ''}
                    onChange={(e) => setFoodForm({
                      ...foodForm,
                      nutritionPer100: {
                        ...foodForm.nutritionPer100!,
                        fat: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fibra (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={foodForm.nutritionPer100?.fiber || ''}
                    onChange={(e) => setFoodForm({
                      ...foodForm,
                      nutritionPer100: {
                        ...foodForm.nutritionPer100!,
                        fiber: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Azúcares (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={foodForm.nutritionPer100?.sugar || ''}
                    onChange={(e) => setFoodForm({
                      ...foodForm,
                      nutritionPer100: {
                        ...foodForm.nutritionPer100!,
                        sugar: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-4">
            <Button variant="outline" onClick={() => setFoodDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveFood}
              disabled={!foodForm.name || !foodForm.nutritionPer100?.kcal}
              className="bg-gradient-warm"
            >
              {editingFood ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EQUIVALENCE DIALOG */}
      <Dialog open={equivDialog} onOpenChange={setEquivDialog}>
        <DialogContent className="max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingEquiv ? 'Editar equivalencia' : 'Nueva equivalencia'}
            </DialogTitle>
            <DialogDescription>
              Define una conversión personalizada para facilitar el registro
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1">
            <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nombre descriptivo</Label>
              <Input
                value={equivForm.name}
                onChange={(e) => setEquivForm({ ...equivForm, name: e.target.value })}
                placeholder="Ej: Puñado de nueces"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Unidad</Label>
                <Input
                  value={equivForm.unitLabel}
                  onChange={(e) => setEquivForm({ ...equivForm, unitLabel: e.target.value })}
                  placeholder="Ej: puñado"
                />
              </div>
              <div className="space-y-2">
                <Label>Gramos equivalentes</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={equivForm.gramsPerUnit || ''}
                  onChange={(e) => setEquivForm({ 
                    ...equivForm, 
                    gramsPerUnit: parseFloat(e.target.value) || 0 
                  })}
                  placeholder="Ej: 25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas (opcional)</Label>
              <Input
                value={equivForm.notes || ''}
                onChange={(e) => setEquivForm({ ...equivForm, notes: e.target.value })}
                placeholder="Ej: Aproximadamente 10-12 nueces"
              />
            </div>
          </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEquivDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEquiv}
              disabled={!equivForm.name || !equivForm.unitLabel || !equivForm.gramsPerUnit}
              className="bg-gradient-warm"
            >
              {editingEquiv ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE FOOD DIALOG */}
      <AlertDialog open={deleteFood !== null} onOpenChange={(open) => !open && setDeleteFood(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar alimento?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará "{deleteFood?.name}" de tu base de datos. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFood}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE EQUIVALENCE DIALOG */}
      <AlertDialog open={deleteEquiv !== null} onOpenChange={(open) => !open && setDeleteEquiv(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar equivalencia?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará "{deleteEquiv?.name}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEquiv}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* IMPORT DIALOG */}
      <AlertDialog open={importDialog} onOpenChange={setImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importar datos</AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona un archivo de copia de seguridad (.json) previamente exportado desde Trazaria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </>
  );
};

export default Database;
