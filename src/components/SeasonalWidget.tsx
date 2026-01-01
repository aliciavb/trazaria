import { getSeasonalProduce } from '@/lib/seasonality';
import { Card } from '@/components/ui/card';
import { Leaf, Carrot, Apple } from 'lucide-react';

interface SeasonalWidgetProps {
  date?: Date;
}

const SeasonalWidget = ({ date = new Date() }: SeasonalWidgetProps) => {
  const { fruits, vegetables } = getSeasonalProduce(date);
  const monthName = date.toLocaleDateString('es-ES', { month: 'long' });

  return (
    <Card className="overflow-hidden border-none shadow-md bg-[#fdfbf7]">
      {/* Header estilo "Cinta adhesiva" o cabecera de libreta */}
      <div className="bg-[#e8e4d9] p-3 border-b border-[#d6d3c9] flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-700" />
        <h3 className="font-serif text-sm font-bold text-stone-700 uppercase tracking-wider">
          De temporada en {monthName}
        </h3>
      </div>

      <div className="p-4 space-y-4 font-serif text-stone-800">
        {/* Frutas */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-orange-700/80">
            <Apple className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-sans">Frutas</span>
          </div>
          <p className="text-sm leading-relaxed">
            {fruits.join(', ')}.
          </p>
        </div>

        {/* Verduras */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-green-700/80">
            <Carrot className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-sans">Verduras</span>
          </div>
          <p className="text-sm leading-relaxed">
            {vegetables.join(', ')}.
          </p>
        </div>
      </div>
      
      {/* Footer decorativo */}
      <div className="h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZjRmNGY0Ii8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')] opacity-20"></div>
    </Card>
  );
};

export default SeasonalWidget;
