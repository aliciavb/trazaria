import { Card } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const Week = () => {
  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Semana</h1>
            <p className="text-muted-foreground">
              Resumen semanal y tendencias
            </p>
          </div>

          <Card className="p-8 text-center bg-gradient-card shadow-card">
            <p className="text-muted-foreground">
              Gráficas semanales en desarrollo
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aquí verás kcal, proteína, hidratos y grasas por día
            </p>
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Week;
