// Natural language parser for food entries
import { UserEquivalence } from './db';

export interface ParsedItem {
  name: string;
  qty?: number;
  unit?: string;
  approximate?: boolean;
}

export function parseNaturalLanguage(
  input: string,
  equivalences: UserEquivalence[] = []
): ParsedItem[] {
  // Normalize input
  const normalized = input
    .toLowerCase()
    .replace(/～/g, '~')
    .replace(/≈/g, '~')
    .trim();

  // Split by common separators: +, comma, "y"
  const segments = normalized
    .split(/\s*(?:\+|,|\sy\s)\s*/)
    .filter(s => s.trim().length > 0);

  const items: ParsedItem[] = [];

  for (const segment of segments) {
    const parsed = parseSegment(segment, equivalences);
    if (parsed) {
      items.push(parsed);
    }
  }

  return items;
}

function parseSegment(
  segment: string,
  equivalences: UserEquivalence[]
): ParsedItem | null {
  // Check for approximate indicator
  const approximate = segment.includes('~') || segment.includes('≈');
  const cleaned = segment.replace(/[~≈]/g, '').trim();

  // Pattern: [qty] [unit] [name] or [name] [qty] [unit]
  // Common units: g, ml, kg, taza, vaso, puñado, cucharada, cucharadita, bol, unidad, cinta
  const unitPattern = /\b(g|gr|gramos?|ml|mililitros?|kg|kilogramos?|l|litros?|taza|tazas|vaso|vasos|puñado|puñados|cucharada|cucharadas|cucharadita|cucharaditas|bol|boles|unidad|unidades|cinta|cintas)\b/i;
  
  // Try to extract quantity and unit
  const numberPattern = /(\d+(?:[.,]\d+)?)/;
  
  const numberMatch = cleaned.match(numberPattern);
  const unitMatch = cleaned.match(unitPattern);

  let qty: number | undefined;
  let unit: string | undefined;
  let name: string;

  if (numberMatch) {
    qty = parseFloat(numberMatch[1].replace(',', '.'));
  }

  if (unitMatch) {
    unit = normalizeUnit(unitMatch[1]);
  }

  // Remove qty and unit from the string to get the name
  name = cleaned
    .replace(numberPattern, '')
    .replace(unitPattern, '')
    .trim();

  // If name is empty, segment was malformed
  if (!name) {
    return null;
  }

  // Check if we have a matching equivalence
  if (unit && equivalences.length > 0) {
    const equiv = equivalences.find(
      e => e.unitLabel.toLowerCase() === unit?.toLowerCase()
    );
    if (equiv && !qty) {
      // Use equivalence default (1 unit)
      qty = 1;
    }
  }

  return {
    name,
    qty,
    unit,
    approximate,
  };
}

function normalizeUnit(unit: string): string {
  const normalized = unit.toLowerCase();
  
  // Plural to singular
  const singularMap: Record<string, string> = {
    'gramos': 'g',
    'gramo': 'g',
    'gr': 'g',
    'mililitros': 'ml',
    'mililitro': 'ml',
    'kilogramos': 'kg',
    'kilogramo': 'kg',
    'litros': 'l',
    'litro': 'l',
    'tazas': 'taza',
    'vasos': 'vaso',
    'puñados': 'puñado',
    'cucharadas': 'cucharada',
    'cucharaditas': 'cucharadita',
    'boles': 'bol',
    'unidades': 'unidad',
    'cintas': 'cinta',
  };

  return singularMap[normalized] || normalized;
}

export function detectMealType(input: string): string | null {
  const lower = input.toLowerCase();
  
  if (lower.includes('desayuno')) return 'breakfast';
  if (lower.includes('almuerzo') || lower.includes('comida')) return 'lunch';
  if (lower.includes('cena')) return 'dinner';
  if (lower.includes('snack') || lower.includes('merienda') || lower.includes('tentempié')) return 'snack';
  if (lower.includes('entrenamiento') || lower.includes('ejercicio') || lower.includes('deporte')) return 'activity';
  
  return null;
}

export interface ExtractedNutrition {
  kcal?: number;
  protein?: number;
  fat?: number;
  saturatedFat?: number;
  carbs?: number;
  sugar?: number;
  fiber?: number;
  salt?: number;
}

export function extractNutritionFromText(text: string): ExtractedNutrition {
  const result: ExtractedNutrition = {};
  
  // Helper to convert comma decimal to point decimal
  const parseDecimal = (str: string) => parseFloat(str.replace(',', '.'));
  
  // Extract kcal - look for patterns like "488 kcal", "2032 kJ / 488 kcal"
  const kcalMatch = text.match(/(\d+(?:[,.]\d+)?)\s*kcal/i);
  if (kcalMatch) {
    result.kcal = parseDecimal(kcalMatch[1]);
  }
  
  // Extract protein - look for "Proteínas: 4,5 g"
  const proteinMatch = text.match(/prote[íi]nas?[:\s]+(\d+(?:[,.]\d+)?)\s*g/i);
  if (proteinMatch) {
    result.protein = parseDecimal(proteinMatch[1]);
  }
  
  // Extract fat - look for "Grasas: 33,5 g" or "Lípidos: 33,5 g"
  const fatMatch = text.match(/(?:grasas?|l[íi]pidos?)(?!\s+saturadas?)[:\s]+(\d+(?:[,.]\d+)?)\s*g/i);
  if (fatMatch) {
    result.fat = parseDecimal(fatMatch[1]);
  }

  // Extract saturated fat - look for "de las cuales saturadas: 12 g"
  const satFatMatch = text.match(/(?:de las cuales\s+)?(?:saturadas?|ácidos grasos saturados?)[^:]*:[^\d]*(\d+(?:[,.]\d+)?)\s*g/i);
  if (satFatMatch) {
    result.saturatedFat = parseDecimal(satFatMatch[1]);
  }
  
  // Extract carbs - look for "Hidratos de carbono: 41,2 g"
  const carbsMatch = text.match(/hidratos?[^:]*:[^\d]*(\d+(?:[,.]\d+)?)\s*g/i);
  if (carbsMatch) {
    result.carbs = parseDecimal(carbsMatch[1]);
  }
  
  // Extract sugar - look for "Azúcares: 17,2 g" or "de los cuales azúcares: 17,2 g"
  const sugarMatch = text.match(/(?:de los cuales\s+)?az[úu]cares?[^:]*:[^\d]*(\d+(?:[,.]\d+)?)\s*g/i);
  if (sugarMatch) {
    result.sugar = parseDecimal(sugarMatch[1]);
  }
  
  // Extract fiber - look for "Fibra: 1,9 g"
  const fiberMatch = text.match(/fibra[^:]*:[^\d]*(\d+(?:[,.]\d+)?)\s*g/i);
  if (fiberMatch) {
    result.fiber = parseDecimal(fiberMatch[1]);
  }

  // Extract salt - look for "Sal: 1,2 g"
  const saltMatch = text.match(/sal[^:]*:[^\d]*(\d+(?:[,.]\d+)?)\s*g/i);
  if (saltMatch) {
    result.salt = parseDecimal(saltMatch[1]);
  }
  
  return result;
}
