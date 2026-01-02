import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { db, UserProfile } from '@/lib/db';
import { calculateDailyCalories, getCalorieFormulaExplanation } from '@/lib/calories';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, User, Calculator } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  age: z.number().min(13, 'Debes tener al menos 13 años').max(120, 'Edad inválida'),
  height: z.number().min(100, 'Altura mínima 100cm').max(250, 'Altura máxima 250cm'),
  weight: z.number().min(30, 'Peso mínimo 30kg').max(300, 'Peso máximo 300kg'),
});

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'non-binary' | 'prefer-not-to-say'>('prefer-not-to-say');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');

  const handleComplete = async () => {
    try {
      // Validate inputs
      const validated = profileSchema.parse({
        age: parseInt(age),
        height: parseInt(height),
        weight: parseFloat(weight),
      });

      const dailyKcal = calculateDailyCalories({
        age: validated.age,
        sex,
        height: validated.height,
        weight: validated.weight,
        goal,
        activityLevel,
      });

      const profile: UserProfile = {
        id: 'user-profile',
        age: validated.age,
        sex,
        height: validated.height,
        weight: validated.weight,
        goal,
        activityLevel,
        dailyKcal,
        createdAt: new Date().toISOString(),
      };

      await db.profile.put(profile);

      toast({
        title: '¡Perfil creado!',
        description: `Tu objetivo diario: ${dailyKcal} kcal`,
      });

      navigate('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Datos inválidos',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo guardar el perfil',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-warm mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bienvenido a Trazaria</h1>
          <p className="text-muted-foreground">
            Vamos a personalizar tu experiencia
          </p>
        </div>

        {step === 1 && (
          <Card className="p-6 space-y-6 bg-gradient-card shadow-elevated">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ej: 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="13"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label>Sexo (opcional)</Label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'male', label: 'Hombre' },
                    { value: 'female', label: 'Mujer' },
                    { value: 'non-binary', label: 'No binario' },
                    { value: 'prefer-not-to-say', label: 'Prefiero no decir' },
                  ].map((option) => (
                    <Badge
                      key={option.value}
                      variant={sex === option.value ? 'default' : 'outline'}
                      className="cursor-pointer px-4 py-2"
                      onClick={() => setSex(option.value as any)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Ej: 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Ej: 65.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="300"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!age || !height || !weight}
              className="w-full bg-gradient-warm text-primary hover:text-primary"
              size="lg"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6 space-y-6 bg-gradient-card shadow-elevated">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>¿Cuál es tu objetivo?</Label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'lose', label: 'Perder peso' },
                    { value: 'maintain', label: 'Mantener' },
                    { value: 'gain', label: 'Ganar peso' },
                  ].map((option) => (
                    <Badge
                      key={option.value}
                      variant={goal === option.value ? 'default' : 'outline'}
                      className="cursor-pointer px-4 py-2"
                      onClick={() => setGoal(option.value as any)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nivel de actividad</Label>
                <div className="space-y-2">
                  {[
                    { value: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio' },
                    { value: 'light', label: 'Ligero', desc: 'Ejercicio 1-3 días/semana' },
                    { value: 'moderate', label: 'Moderado', desc: 'Ejercicio 3-5 días/semana' },
                    { value: 'active', label: 'Activo', desc: 'Ejercicio 6-7 días/semana' },
                    { value: 'very-active', label: 'Muy activo', desc: 'Ejercicio intenso diario' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setActivityLevel(option.value as any)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        activityLevel === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-warm text-primary hover:text-primary"
                size="lg"
              >
                Ver mi objetivo
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6 space-y-6 bg-gradient-card shadow-elevated">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-warm mb-2">
                  <Calculator className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Tu objetivo diario calculado</h2>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-center text-4xl font-bold text-primary">
                  {calculateDailyCalories({
                    age: parseInt(age),
                    sex,
                    height: parseInt(height),
                    weight: parseFloat(weight),
                    goal,
                    activityLevel,
                  })} kcal/día
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Cómo calculamos tu objetivo:</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
                    {getCalorieFormulaExplanation(
                      {
                        age: parseInt(age),
                        sex,
                        height: parseInt(height),
                        weight: parseFloat(weight),
                        goal,
                        activityLevel,
                      },
                      calculateDailyCalories({
                        age: parseInt(age),
                        sex,
                        height: parseInt(height),
                        weight: parseFloat(weight),
                        goal,
                        activityLevel,
                      })
                    )}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  📚 Referencia: Mifflin MD, St Jeor ST, et al. "A new predictive equation for resting energy expenditure in healthy individuals." Am J Clin Nutr. 1990;51(2):241-7.
                </p>
              </div>

              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 Puedes ajustar manualmente este valor en cualquier momento desde Configuración si prefieres establecer tu propio objetivo.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-warm text-primary hover:text-primary"
                size="lg"
              >
                Completar
              </Button>
            </div>
          </Card>
        )}

        <div className="text-center text-xs text-muted-foreground">
          <p>🔒 Tus datos son tuyos. Siempre.</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
