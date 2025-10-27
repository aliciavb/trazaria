// Base de datos inicial de alimentos - Fuente: BEDCA
// 
// BEDCA (Base de Datos Española de Composición de Alimentos)
// https://www.bedca.net
// 
// BEDCA es la base de datos oficial del Ministerio de Ciencia e Innovación de España
// y es mantenida por el Instituto de Salud Carlos III. Contiene información nutricional
// verificada y estandarizada de alimentos españoles.
//
// IMPORTANTE - Sobre la variabilidad de datos:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Los valores nutricionales mostrados son PROMEDIOS y pueden variar entre ±5% y ±20%
// dependiendo de factores como:
//   • Variedad específica del producto (ej: manzana Golden vs Fuji)
//   • Grado de madurez (frutas y verduras)
//   • Método de cocción y procesado
//   • Origen geográfico y temporada
//   • Marca comercial específica
//
// Fiabilidad de fuentes:
//   ★★★★★ BEDCA: Datos oficiales verificados (recomendado para alimentos genéricos)
//   ★★★★☆ Etiqueta del producto: Datos exactos pero solo para ESE producto específico
//   ★★★☆☆ Estimaciones del usuario: Pueden tener mayor margen de error
//
// TODOS los alimentos de esta base son EDITABLES:
//   • Puedes ajustar los valores si tienes la etiqueta de TU producto específico
//   • Puedes duplicarlos y crear versiones personalizadas
//   • Los cambios NO afectan a otras entradas ya registradas
//
// Para productos empaquetados: SIEMPRE es mejor crear tu propia entrada con los
// datos exactos de la etiqueta nutricional.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { FoodItem, UserEquivalence } from './db';

export const basicFoods: FoodItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FRUTAS (BEDCA)
  // Valores por 100g de porción comestible (sin piel, hueso, etc.)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'platano-bedca',
    name: 'Plátano',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 89, 
      protein: 1.1, 
      carbs: 20.0, 
      fat: 0.3, 
      fiber: 2.6, 
      sugar: 17.2 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'manzana-bedca',
    name: 'Manzana',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 52, 
      protein: 0.3, 
      carbs: 11.4, 
      fat: 0.2, 
      fiber: 2.4, 
      sugar: 10.4 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'kiwi-bedca',
    name: 'Kiwi',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 61, 
      protein: 1.1, 
      carbs: 10.6, 
      fat: 0.5, 
      fiber: 3.0, 
      sugar: 9.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'naranja-bedca',
    name: 'Naranja',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 47, 
      protein: 0.9, 
      carbs: 8.9, 
      fat: 0.1, 
      fiber: 2.4, 
      sugar: 8.5 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'fresas-bedca',
    name: 'Fresas',
    category: 'Frutas',
    defaultUnits: ['g', 'puñado'],
    nutritionPer100: { 
      kcal: 32, 
      protein: 0.7, 
      carbs: 5.5, 
      fat: 0.4, 
      fiber: 2.0, 
      sugar: 4.9 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pera-bedca',
    name: 'Pera',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 57, 
      protein: 0.4, 
      carbs: 12.1, 
      fat: 0.1, 
      fiber: 3.1, 
      sugar: 9.8 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'melocoton-bedca',
    name: 'Melocotón',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 39, 
      protein: 0.9, 
      carbs: 8.1, 
      fat: 0.3, 
      fiber: 1.5, 
      sugar: 7.5 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'sandia-bedca',
    name: 'Sandía',
    category: 'Frutas',
    defaultUnits: ['g', 'taza'],
    nutritionPer100: { 
      kcal: 30, 
      protein: 0.6, 
      carbs: 6.2, 
      fat: 0.2, 
      fiber: 0.4, 
      sugar: 6.2 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'uvas-bedca',
    name: 'Uvas',
    category: 'Frutas',
    defaultUnits: ['g', 'puñado'],
    nutritionPer100: { 
      kcal: 69, 
      protein: 0.7, 
      carbs: 15.5, 
      fat: 0.2, 
      fiber: 0.9, 
      sugar: 15.5 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 18,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'mandarina-bedca',
    name: 'Mandarina',
    category: 'Frutas',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 53, 
      protein: 0.8, 
      carbs: 11.5, 
      fat: 0.3, 
      fiber: 1.8, 
      sugar: 10.6 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VERDURAS Y HORTALIZAS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'tomate-bedca',
    name: 'Tomate',
    category: 'Verduras',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 18, 
      protein: 0.9, 
      carbs: 3.9, 
      fat: 0.2, 
      fiber: 1.2, 
      sugar: 2.6 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'lechuga-bedca',
    name: 'Lechuga',
    category: 'Verduras',
    defaultUnits: ['g', 'taza'],
    nutritionPer100: { 
      kcal: 15, 
      protein: 1.4, 
      carbs: 2.9, 
      fat: 0.2, 
      fiber: 1.3,
      sugar: 0.8
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'zanahoria-bedca',
    name: 'Zanahoria',
    category: 'Verduras',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 41, 
      protein: 0.9, 
      carbs: 7.3, 
      fat: 0.2, 
      fiber: 2.8, 
      sugar: 4.7 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pepino-bedca',
    name: 'Pepino',
    category: 'Verduras',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 15, 
      protein: 0.7, 
      carbs: 3.6, 
      fat: 0.1, 
      fiber: 0.5,
      sugar: 1.7
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 8,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pimiento-bedca',
    name: 'Pimiento',
    category: 'Verduras',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 27, 
      protein: 0.9, 
      carbs: 6.0, 
      fat: 0.3, 
      fiber: 2.1,
      sugar: 4.2
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'calabacin-bedca',
    name: 'Calabacín',
    category: 'Verduras',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 17, 
      protein: 1.2, 
      carbs: 3.1, 
      fat: 0.3, 
      fiber: 1.0,
      sugar: 2.5
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'brocoli-bedca',
    name: 'Brócoli',
    category: 'Verduras',
    defaultUnits: ['g', 'taza'],
    nutritionPer100: { 
      kcal: 34, 
      protein: 2.8, 
      carbs: 7.0, 
      fat: 0.4, 
      fiber: 2.6,
      sugar: 1.7
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'espinacas-bedca',
    name: 'Espinacas',
    category: 'Verduras',
    defaultUnits: ['g', 'taza'],
    nutritionPer100: { 
      kcal: 23, 
      protein: 2.9, 
      carbs: 3.6, 
      fat: 0.4, 
      fiber: 2.2,
      sugar: 0.4
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'cebolla-bedca',
    name: 'Cebolla',
    category: 'Verduras',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 40, 
      protein: 1.1, 
      carbs: 9.3, 
      fat: 0.1, 
      fiber: 1.7, 
      sugar: 4.2 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LÁCTEOS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'leche-entera-bedca',
    name: 'Leche entera',
    category: 'Lácteos',
    defaultUnits: ['ml', 'taza'],
    nutritionPer100: { 
      kcal: 64, 
      protein: 3.3, 
      carbs: 4.7, 
      fat: 3.6, 
      sugar: 4.7 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 8,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'leche-desnatada-bedca',
    name: 'Leche desnatada',
    category: 'Lácteos',
    defaultUnits: ['ml', 'taza'],
    nutritionPer100: { 
      kcal: 35, 
      protein: 3.4, 
      carbs: 5.0, 
      fat: 0.1, 
      sugar: 5.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 5,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'yogur-natural-bedca',
    name: 'Yogur natural',
    category: 'Lácteos',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 61, 
      protein: 3.5, 
      carbs: 4.0, 
      fat: 3.5, 
      sugar: 4.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'yogur-griego-bedca',
    name: 'Yogur griego',
    category: 'Lácteos',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 97, 
      protein: 9.0, 
      carbs: 3.2, 
      fat: 5.0, 
      sugar: 3.2 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'queso-fresco-bedca',
    name: 'Queso fresco',
    category: 'Lácteos',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 174, 
      protein: 13.6, 
      carbs: 4.0, 
      fat: 11.6 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CEREALES Y DERIVADOS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'arroz-cocido-bedca',
    name: 'Arroz blanco cocido',
    category: 'Cereales',
    defaultUnits: ['g', 'bol', 'taza'],
    nutritionPer100: { 
      kcal: 130, 
      protein: 2.7, 
      carbs: 28.0, 
      fat: 0.3, 
      fiber: 0.4,
      sugar: 0.1
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 8,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pasta-cocida-bedca',
    name: 'Pasta cocida',
    category: 'Cereales',
    defaultUnits: ['g', 'bol'],
    nutritionPer100: { 
      kcal: 131, 
      protein: 5.0, 
      carbs: 25.0, 
      fat: 1.1, 
      fiber: 1.8,
      sugar: 0.6
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pan-blanco-bedca',
    name: 'Pan blanco',
    category: 'Cereales',
    defaultUnits: ['g', 'rebanada'],
    nutritionPer100: { 
      kcal: 265, 
      protein: 8.0, 
      carbs: 49.5, 
      fat: 3.2, 
      fiber: 3.5,
      sugar: 2.0
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pan-integral-bedca',
    name: 'Pan integral',
    category: 'Cereales',
    defaultUnits: ['g', 'rebanada'],
    nutritionPer100: { 
      kcal: 247, 
      protein: 9.0, 
      carbs: 41.0, 
      fat: 4.2, 
      fiber: 7.5,
      sugar: 1.2
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'avena-cocida-bedca',
    name: 'Avena cocida',
    category: 'Cereales',
    defaultUnits: ['g', 'taza'],
    nutritionPer100: { 
      kcal: 71, 
      protein: 2.5, 
      carbs: 12.0, 
      fat: 1.4, 
      fiber: 1.7,
      sugar: 0.3
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGUMBRES (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'lentejas-cocidas-bedca',
    name: 'Lentejas cocidas',
    category: 'Legumbres',
    defaultUnits: ['g', 'bol'],
    nutritionPer100: { 
      kcal: 116, 
      protein: 9.0, 
      carbs: 20.1, 
      fat: 0.4, 
      fiber: 7.9,
      sugar: 1.8
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'garbanzos-cocidos-bedca',
    name: 'Garbanzos cocidos',
    category: 'Legumbres',
    defaultUnits: ['g', 'bol'],
    nutritionPer100: { 
      kcal: 164, 
      protein: 8.9, 
      carbs: 27.4, 
      fat: 2.6, 
      fiber: 7.6,
      sugar: 4.8
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'alubias-cocidas-bedca',
    name: 'Alubias blancas cocidas',
    category: 'Legumbres',
    defaultUnits: ['g', 'bol'],
    nutritionPer100: { 
      kcal: 140, 
      protein: 9.7, 
      carbs: 25.0, 
      fat: 0.6, 
      fiber: 6.3,
      sugar: 2.1
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CARNES (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'pollo-plancha-bedca',
    name: 'Pechuga de pollo a la plancha',
    category: 'Carnes',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 165, 
      protein: 31.0, 
      carbs: 0, 
      fat: 3.6 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'lomo-plancha-bedca',
    name: 'Lomo de cerdo a la plancha',
    category: 'Carnes',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 143, 
      protein: 24.0, 
      carbs: 0, 
      fat: 4.8 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'ternera-plancha-bedca',
    name: 'Ternera a la plancha',
    category: 'Carnes',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 181, 
      protein: 27.0, 
      carbs: 0, 
      fat: 7.5 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pavo-plancha-bedca',
    name: 'Pavo a la plancha',
    category: 'Carnes',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 107, 
      protein: 22.0, 
      carbs: 0, 
      fat: 1.7 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PESCADOS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'salmon-plancha-bedca',
    name: 'Salmón a la plancha',
    category: 'Pescados',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 206, 
      protein: 20.0, 
      carbs: 0, 
      fat: 13.6 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 18,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'merluza-plancha-bedca',
    name: 'Merluza a la plancha',
    category: 'Pescados',
    defaultUnits: ['g'],
    nutritionPer100: { 
      kcal: 86, 
      protein: 17.0, 
      carbs: 0, 
      fat: 1.8 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'atun-lata-bedca',
    name: 'Atún en lata',
    category: 'Pescados',
    defaultUnits: ['g', 'lata'],
    nutritionPer100: { 
      kcal: 128, 
      protein: 23.5, 
      carbs: 0, 
      fat: 3.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'sardinas-lata-bedca',
    name: 'Sardinas en lata',
    category: 'Pescados',
    defaultUnits: ['g', 'lata'],
    nutritionPer100: { 
      kcal: 208, 
      protein: 25.0, 
      carbs: 0, 
      fat: 11.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 15,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HUEVOS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'huevo-cocido-bedca',
    name: 'Huevo cocido',
    category: 'Huevos',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 155, 
      protein: 12.6, 
      carbs: 1.1, 
      fat: 10.6 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 8,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FRUTOS SECOS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'almendras-bedca',
    name: 'Almendras',
    category: 'Frutos secos',
    defaultUnits: ['g', 'puñado'],
    nutritionPer100: { 
      kcal: 579, 
      protein: 21.2, 
      carbs: 21.6, 
      fat: 49.9, 
      fiber: 12.5,
      sugar: 4.4
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'nueces-bedca',
    name: 'Nueces',
    category: 'Frutos secos',
    defaultUnits: ['g', 'puñado'],
    nutritionPer100: { 
      kcal: 654, 
      protein: 15.2, 
      carbs: 13.7, 
      fat: 65.2, 
      fiber: 6.7,
      sugar: 2.6
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'avellanas-bedca',
    name: 'Avellanas',
    category: 'Frutos secos',
    defaultUnits: ['g', 'puñado'],
    nutritionPer100: { 
      kcal: 628, 
      protein: 15.0, 
      carbs: 16.7, 
      fat: 60.8, 
      fiber: 9.7,
      sugar: 4.3
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'pistachos-bedca',
    name: 'Pistachos',
    category: 'Frutos secos',
    defaultUnits: ['g', 'puñado'],
    nutritionPer100: { 
      kcal: 562, 
      protein: 20.2, 
      carbs: 27.2, 
      fat: 45.3, 
      fiber: 10.6,
      sugar: 7.7
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACEITES Y GRASAS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'aceite-oliva-bedca',
    name: 'Aceite de oliva',
    category: 'Aceites',
    defaultUnits: ['ml', 'cucharada'],
    nutritionPer100: { 
      kcal: 884, 
      protein: 0, 
      carbs: 0, 
      fat: 100.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 2,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'aceite-girasol-bedca',
    name: 'Aceite de girasol',
    category: 'Aceites',
    defaultUnits: ['ml', 'cucharada'],
    nutritionPer100: { 
      kcal: 884, 
      protein: 0, 
      carbs: 0, 
      fat: 100.0 
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 2,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TUBÉRCULOS (BEDCA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'patata-cocida-bedca',
    name: 'Patata cocida',
    category: 'Tubérculos',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 86, 
      protein: 1.9, 
      carbs: 20.1, 
      fat: 0.1, 
      fiber: 1.8,
      sugar: 0.9
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 10,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'boniato-cocido-bedca',
    name: 'Boniato cocido',
    category: 'Tubérculos',
    defaultUnits: ['g', 'unidad'],
    nutritionPer100: { 
      kcal: 90, 
      protein: 2.0, 
      carbs: 20.1, 
      fat: 0.2, 
      fiber: 3.0,
      sugar: 5.7
    },
    source: 'BEDCA',
    sourceUrl: 'https://www.bedca.net/bdpub/index.php',
    variabilityPct: 12,
    isEditable: true,
    lastModified: new Date().toISOString(),
  },
];

export const defaultEquivalences: UserEquivalence[] = [
  {
    id: 'puñado-frutos-secos',
    name: 'Puñado de frutos secos',
    unitLabel: 'puñado',
    gramsPerUnit: 25,
  },
  {
    id: 'puñado-fresas',
    name: 'Puñado de fresas',
    unitLabel: 'puñado',
    gramsPerUnit: 80,
  },
  {
    id: 'taza-avena',
    name: 'Taza de avena cocida',
    baseFoodId: 'avena-cocida-bedca',
    unitLabel: 'taza',
    gramsPerUnit: 180,
  },
  {
    id: 'cucharada-aceite',
    name: 'Cucharada de aceite',
    baseFoodId: 'aceite-oliva-bedca',
    unitLabel: 'cucharada',
    gramsPerUnit: 15,
  },
  {
    id: 'rebanada-pan',
    name: 'Rebanada de pan',
    baseFoodId: 'pan-blanco-bedca',
    unitLabel: 'rebanada',
    gramsPerUnit: 30,
  },
  {
    id: 'bol-arroz',
    name: 'Bol de arroz cocido',
    baseFoodId: 'arroz-cocido-bedca',
    unitLabel: 'bol',
    gramsPerUnit: 200,
  },
  {
    id: 'bol-pasta',
    name: 'Bol de pasta cocida',
    baseFoodId: 'pasta-cocida-bedca',
    unitLabel: 'bol',
    gramsPerUnit: 180,
  },
  {
    id: 'yogur-unidad',
    name: 'Yogur (unidad)',
    baseFoodId: 'yogur-natural-bedca',
    unitLabel: 'unidad',
    gramsPerUnit: 125,
  },
  {
    id: 'huevo-unidad',
    name: 'Huevo mediano',
    baseFoodId: 'huevo-cocido-bedca',
    unitLabel: 'unidad',
    gramsPerUnit: 50,
  },
  {
    id: 'lata-atun',
    name: 'Lata de atún',
    baseFoodId: 'atun-lata-bedca',
    unitLabel: 'lata',
    gramsPerUnit: 80,
  },
];
