// Calculate daily calorie needs using Mifflin-St Jeor Equation
// Reference: Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
// "A new predictive equation for resting energy expenditure in healthy individuals."
// Am J Clin Nutr. 1990;51(2):241-7. doi: 10.1093/ajcn/51.2.241

export interface CalorieParams {
  age: number;
  sex: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'lose' | 'maintain' | 'gain';
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  'very-active': 1.9, // Very hard exercise & physical job
};

const GOAL_ADJUSTMENTS = {
  lose: -300, // Deficit of 300 kcal for ~0.3kg loss per week (más sostenible)
  maintain: 0,
  gain: 300, // Surplus of 300 kcal for slow gain
};

export function calculateDailyCalories(params: CalorieParams): number {
  const { age, sex, height, weight, activityLevel, goal } = params;

  // Mifflin-St Jeor Equation for BMR (Basal Metabolic Rate)
  let bmr: number;

  if (sex === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Use male formula for male, non-binary, and prefer-not-to-say
    // This is a simplification; ideally we'd offer more personalization
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

  // Apply goal adjustment
  const adjusted = tdee + GOAL_ADJUSTMENTS[goal];

  // Round to nearest 50 kcal for cleaner numbers
  return Math.round(adjusted / 50) * 50;
}

export function calculateFoodCalories(
  grams: number,
  nutritionPer100: { kcal: number }
): number {
  return Math.round((grams / 100) * nutritionPer100.kcal);
}

export function getCalorieFormulaExplanation(params: CalorieParams, dailyKcal: number): string {
  const { age, sex, height, weight, activityLevel, goal } = params;
  
  // Calculate BMR
  const bmr = sex === 'female' 
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;
  
  const activityLabels = {
    sedentary: 'Sedentario (×1.2)',
    light: 'Ligero (×1.375)',
    moderate: 'Moderado (×1.55)',
    active: 'Activo (×1.725)',
    'very-active': 'Muy activo (×1.9)',
  };
  
  const goalLabels = {
    lose: 'Perder peso (-300 kcal)',
    maintain: 'Mantener peso (±0 kcal)',
    gain: 'Ganar peso (+300 kcal)',
  };
  
  const sexLabel = sex === 'female' ? 'mujer' : 'hombre';
  const formula = sex === 'female'
    ? '10×peso + 6.25×altura - 5×edad - 161'
    : '10×peso + 6.25×altura - 5×edad + 5';
  
  return `${formula}

Factor de actividad: ${activityLabels[activityLevel]}
Ajuste por objetivo: ${goalLabels[goal]}
Objetivo diario = ${dailyKcal} kcal/día`;
}
