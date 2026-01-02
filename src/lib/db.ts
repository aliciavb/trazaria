// Local-first database using Dexie (IndexedDB wrapper)
import Dexie, { Table } from 'dexie';

export interface FoodItem {
  id?: string;
  name: string;
  brand?: string;
  category?: string;
  defaultUnits: string[];
  nutritionPer100: {
    kcal: number;
    carbs: number;
    fat: number;
    saturatedFat?: number;
    protein: number;
    fiber?: number;
    sugar?: number;
    salt?: number;
  };
  source: 'custom' | 'barcode' | 'nl' | 'BEDCA' | 'USDA';
  sourceUrl?: string; // URL de donde se obtuvieron los datos
  variabilityPct?: number; // % de variabilidad esperada (10-20% típico)
  notes?: string; // Notas del usuario sobre el alimento
  isEditable?: boolean; // Si false, solo se puede duplicar/modificar, no eliminar
  lastUsedAt?: string;
  lastModified?: string; // Fecha de última modificación
}

export interface UserEquivalence {
  id?: string;
  name: string;
  baseFoodId?: string;
  unitLabel: string;
  gramsPerUnit: number;
  notes?: string;
}

export interface Recipe {
  id?: string;
  name: string;
  items: Array<{
    foodId?: string;
    name: string;
    qty: number;
    unit: string;
    note?: string;
    optional?: boolean;
  }>;
  tags: string[];
  lastUsedAt?: string;
}

export interface UserProfile {
  id?: string;
  age: number;
  sex: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  height: number; // cm
  weight: number; // kg
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dailyKcal: number;
  manualKcal?: number; // If set, overrides calculated dailyKcal
  createdAt: string;
}

export interface Entry {
  id?: string;
  dateISO: string;
  time?: string; // HH:MM format
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'activity';
  items: Array<{
    foodId?: string;
    name: string;
    qty: number;
    unit: string;
    kcal?: number;
    carbs?: number;
    fat?: number;
    saturatedFat?: number;
    protein?: number;
    fiber?: number;
    sugar?: number;
    salt?: number;
  }>;
  totalKcal?: number;
  notes?: string;
  mood?: string;
  energy?: number;
  satiety?: number;
  wellbeing?: {
    hunger: 'very-hungry' | 'hungry' | 'satisfied' | 'full' | 'very-full';
    energy?: 'low' | 'normal' | 'high';
    mood?: 'bad' | 'neutral' | 'good';
    notes?: string;
  };
}

// Dexie Database Class
export class TrazariaDB extends Dexie {
  foods!: Table<FoodItem, string>;
  equivalences!: Table<UserEquivalence, string>;
  recipes!: Table<Recipe, string>;
  profile!: Table<UserProfile, string>;
  entries!: Table<Entry, string>;

  constructor() {
    super('TrazariaDB');
    
    this.version(1).stores({
      foods: 'id, name, brand, category, lastUsedAt, source',
      equivalences: 'id, name, unitLabel',
      recipes: 'id, name, lastUsedAt',
      profile: 'id',
      entries: 'id, dateISO, type',
    });
  }
}

// Export single database instance
export const db = new TrazariaDB();

// Import seed data from separate file
import { basicFoods, defaultEquivalences } from './db-seed';
export { basicFoods, defaultEquivalences };

export async function seedDatabase() {
  // Check if already seeded
  const existingFoods = await db.foods.count();
  if (existingFoods > 0) return;

  // Add basic foods from BEDCA
  await db.foods.bulkAdd(basicFoods);
  
  // Add equivalences
  await db.equivalences.bulkAdd(defaultEquivalences);
}
