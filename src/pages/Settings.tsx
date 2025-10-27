import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNav from '@/components/BottomNav';
import { Database, Download, Upload, Trash2, Lock, Moon, Sun, User, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { db } from '@/lib/db';
import { calculateDailyCalories, CalorieParams } from '@/lib/calories';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState<CalorieParams | null>(null);
  const [currentDailyKcal, setCurrentDailyKcal] = useState<number>(0);
  const [useManualKcal, setUseManualKcal] = useState(false);
  const [manualKcal, setManualKcal] = useState('');
  
  // Estados del formulario
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'non-binary' | 'prefer-not-to-say'>('female');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await db.profile.toArray();
    if (userProfile.length > 0) {
      const p = userProfile[0];
      setProfile(p);
      setCurrentDailyKcal(p.manualKcal || p.dailyKcal);
      setUseManualKcal(!!p.manualKcal);
      setManualKcal(p.manualKcal?.toString() || '');
      setAge(p.age.toString());
      setSex(p.sex);
      setHeight(p.height.toString());
      setWeight(p.weight.toString());
      setActivityLevel(p.activityLevel);
      setGoal(p.goal);
    }
  };

  const handleSaveProfile = async () => {
    if (!age || !height || !weight) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    if (useManualKcal && (!manualKcal || parseInt(manualKcal) < 1000 || parseInt(manualKcal) > 5000)) {
      toast({
        title: 'Valor inválido',
        description: 'El objetivo manual debe estar entre 1000 y 5000 kcal',
        variant: 'destructive',
      });
      return;
    }

    const newProfile: CalorieParams = {
      age: parseInt(age),
      sex,
      height: parseInt(height),
      weight: parseInt(weight),
      activityLevel,
      goal,
    };

    const calculatedCalories = calculateDailyCalories(newProfile);
    const finalKcal = useManualKcal ? parseInt(manualKcal) : calculatedCalories;

    try {
      await db.profile.clear();
      await db.profile.add({
        id: 'main',
        ...newProfile,
        dailyKcal: calculatedCalories,
        manualKcal: useManualKcal ? parseInt(manualKcal) : undefined,
        createdAt: new Date().toISOString(),
      });

      setProfile(newProfile);
      setCurrentDailyKcal(finalKcal);
      setEditProfileOpen(false);

      toast({
        title: '✓ Perfil actualizado',
        description: `Nuevo objetivo: ${finalKcal} kcal/día${useManualKcal ? ' (manual)' : ''}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Ajustes</h1>
            <p className="text-muted-foreground">
              Configuración y gestión de datos
            </p>
          </div>

          <Card className="p-6 space-y-4 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Perfil Personal</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile ? `${profile.weight} kg • ${currentDailyKcal} kcal/día${useManualKcal ? ' (manual)' : ''}` : 'No configurado'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditProfileOpen(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold">Modo oscuro</h3>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Activado' : 'Desactivado'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <Lock className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Privacidad Total</h3>
                <p className="text-sm text-muted-foreground">
                  Tus datos solo están en tu dispositivo
                </p>
              </div>
              <Badge variant="secondary">Offline</Badge>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar datos (CSV/JSON)
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar datos
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Database className="w-4 h-4 mr-2" />
                Gestionar equivalencias
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                disabled
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Borrar todos los datos
              </Button>
            </div>
          </Card>

          <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
            <p>🔒 Sin cuentas • Sin nube • Sin analítica</p>
            <p>100% privado y de código abierto</p>
          </div>
        </div>
      </div>

      {/* Dialog para editar perfil */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil Personal</DialogTitle>
            <DialogDescription>
              Actualiza tus datos para recalcular tu objetivo calórico diario
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Mujer</SelectItem>
                    <SelectItem value="male">Hombre</SelectItem>
                    <SelectItem value="non-binary">No binario</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="165"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="65"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Nivel de actividad</Label>
              <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentario (poco/nada ejercicio)</SelectItem>
                  <SelectItem value="light">Ligero (1-3 días/semana)</SelectItem>
                  <SelectItem value="moderate">Moderado (3-5 días/semana)</SelectItem>
                  <SelectItem value="active">Activo (6-7 días/semana)</SelectItem>
                  <SelectItem value="very-active">Muy activo (ejercicio intenso + trabajo físico)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Objetivo</Label>
              <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Perder peso (-300 kcal/día)</SelectItem>
                  <SelectItem value="maintain">Mantener peso</SelectItem>
                  <SelectItem value="gain">Ganar peso (+300 kcal/día)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="manualKcal">Objetivo manual</Label>
                  <p className="text-xs text-muted-foreground">
                    Establecer calorías diarias manualmente
                  </p>
                </div>
                <Switch
                  checked={useManualKcal}
                  onCheckedChange={setUseManualKcal}
                />
              </div>
              
              {useManualKcal && (
                <div className="space-y-2">
                  <Input
                    id="manualKcal"
                    type="number"
                    placeholder="2000"
                    value={manualKcal}
                    onChange={(e) => setManualKcal(e.target.value)}
                    min="1000"
                    max="5000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Entre 1000 y 5000 kcal/día
                  </p>
                </div>
              )}
            </div>

            {age && height && weight && !useManualKcal && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Objetivo calculado: <span className="font-semibold text-foreground">
                    {calculateDailyCalories({
                      age: parseInt(age),
                      sex,
                      height: parseInt(height),
                      weight: parseInt(weight),
                      activityLevel,
                      goal,
                    })} kcal/día
                  </span>
                </p>
              </div>
            )}

            {useManualKcal && manualKcal && (
              <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                <p className="text-sm text-primary">
                  Objetivo manual: <span className="font-semibold">
                    {manualKcal} kcal/día
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditProfileOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1">
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
};

export default Settings;
