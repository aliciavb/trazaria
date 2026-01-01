export interface SeasonalProduce {
  fruits: string[];
  vegetables: string[];
}

// Datos aproximados para España/Clima Mediterráneo
export const SEASONAL_CALENDAR: Record<number, SeasonalProduce> = {
  0: { // Enero
    fruits: ['Naranja', 'Mandarina', 'Limón', 'Pomelo', 'Kiwi', 'Plátano', 'Manzana'],
    vegetables: ['Acelga', 'Alcachofa', 'Apio', 'Brócoli', 'Coliflor', 'Espinaca', 'Guisante', 'Haba', 'Lechuga', 'Puerro', 'Remolacha', 'Zanahoria']
  },
  1: { // Febrero
    fruits: ['Naranja', 'Mandarina', 'Limón', 'Pomelo', 'Kiwi', 'Plátano', 'Fresa'],
    vegetables: ['Acelga', 'Alcachofa', 'Apio', 'Brócoli', 'Coliflor', 'Espárrago verde', 'Espinaca', 'Guisante', 'Haba', 'Lechuga', 'Puerro']
  },
  2: { // Marzo
    fruits: ['Naranja', 'Mandarina', 'Limón', 'Pomelo', 'Kiwi', 'Fresa', 'Níspero'],
    vegetables: ['Acelga', 'Alcachofa', 'Apio', 'Brócoli', 'Coliflor', 'Espárrago verde', 'Espinaca', 'Guisante', 'Haba', 'Lechuga']
  },
  3: { // Abril
    fruits: ['Naranja', 'Limón', 'Fresa', 'Níspero', 'Plátano'],
    vegetables: ['Acelga', 'Alcachofa', 'Brócoli', 'Coliflor', 'Espárrago verde', 'Espinaca', 'Guisante', 'Haba', 'Lechuga', 'Zanahoria']
  },
  4: { // Mayo
    fruits: ['Albaricoque', 'Cereza', 'Fresa', 'Níspero', 'Nectarina', 'Melocotón', 'Plátano'],
    vegetables: ['Acelga', 'Alcachofa', 'Espárrago verde', 'Espinaca', 'Guisante', 'Haba', 'Judía verde', 'Lechuga', 'Zanahoria', 'Pepino']
  },
  5: { // Junio
    fruits: ['Albaricoque', 'Breva', 'Cereza', 'Ciruela', 'Frambuesa', 'Higo', 'Melocotón', 'Melón', 'Nectarina', 'Paraguaya', 'Plátano', 'Sandía'],
    vegetables: ['Acelga', 'Ajo', 'Calabacín', 'Cebolla', 'Espárrago verde', 'Judía verde', 'Lechuga', 'Pepino', 'Pimiento', 'Tomate', 'Zanahoria']
  },
  6: { // Julio
    fruits: ['Albaricoque', 'Ciruela', 'Frambuesa', 'Higo', 'Melocotón', 'Melón', 'Nectarina', 'Paraguaya', 'Pera', 'Plátano', 'Sandía'],
    vegetables: ['Acelga', 'Ajo', 'Berenjena', 'Calabacín', 'Cebolla', 'Judía verde', 'Lechuga', 'Pepino', 'Pimiento', 'Tomate', 'Zanahoria']
  },
  7: { // Agosto
    fruits: ['Ciruela', 'Frambuesa', 'Higo', 'Mango', 'Manzana', 'Melocotón', 'Melón', 'Nectarina', 'Paraguaya', 'Pera', 'Plátano', 'Sandía', 'Uva'],
    vegetables: ['Acelga', 'Ajo', 'Berenjena', 'Calabacín', 'Cebolla', 'Judía verde', 'Lechuga', 'Pepino', 'Pimiento', 'Tomate', 'Zanahoria']
  },
  8: { // Septiembre
    fruits: ['Granada', 'Higo', 'Mango', 'Manzana', 'Melocotón', 'Melón', 'Pera', 'Plátano', 'Uva'],
    vegetables: ['Acelga', 'Ajo', 'Berenjena', 'Calabaza', 'Cebolla', 'Espinaca', 'Judía verde', 'Lechuga', 'Pepino', 'Pimiento', 'Tomate', 'Zanahoria']
  },
  9: { // Octubre
    fruits: ['Caqui', 'Chirimoya', 'Granada', 'Kiwi', 'Limón', 'Mandarina', 'Mango', 'Manzana', 'Pera', 'Plátano', 'Uva'],
    vegetables: ['Acelga', 'Alcachofa', 'Apio', 'Berenjena', 'Brócoli', 'Calabaza', 'Coliflor', 'Espinaca', 'Judía verde', 'Lechuga', 'Pimiento', 'Puerro', 'Remolacha']
  },
  10: { // Noviembre
    fruits: ['Caqui', 'Chirimoya', 'Granada', 'Kiwi', 'Limón', 'Mandarina', 'Naranja', 'Manzana', 'Pera', 'Plátano', 'Uva'],
    vegetables: ['Acelga', 'Alcachofa', 'Apio', 'Brócoli', 'Calabaza', 'Cardo', 'Coliflor', 'Espinaca', 'Guisante', 'Lechuga', 'Puerro', 'Remolacha']
  },
  11: { // Diciembre
    fruits: ['Caqui', 'Chirimoya', 'Kiwi', 'Limón', 'Mandarina', 'Naranja', 'Pomelo', 'Manzana', 'Pera', 'Plátano', 'Uva'],
    vegetables: ['Acelga', 'Alcachofa', 'Apio', 'Brócoli', 'Cardo', 'Coliflor', 'Espinaca', 'Guisante', 'Haba', 'Lechuga', 'Puerro', 'Remolacha']
  }
};

export const getSeasonalProduce = (date: Date = new Date()): SeasonalProduce => {
  const month = date.getMonth();
  return SEASONAL_CALENDAR[month] || { fruits: [], vegetables: [] };
};
