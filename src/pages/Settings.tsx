import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import BottomNav from '@/components/BottomNav';
import { Database, Download, Upload, Trash2, Lock, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

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
      <BottomNav />
    </>
  );
};

export default Settings;
