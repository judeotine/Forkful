

export type Diet = "gluten free" | "ketogenic" | "vegetarian" | "vegan" | "paleo" | "low fodmap";
export type Intolerance = "dairy" | "egg" | "gluten" | "peanut" | "shellfish" | "soy" | "wheat" | "tree nut";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  servings?: number;
  readyInMinutes?: number;
  license?: string;
  sourceName?: string;
  sourceUrl?: string;
  spoonacularScore?: number;
  healthScore?: number;
  spoonacularSourceUrl?: string;
  pricePerServing?: number;
  cheap?: boolean;
  creditsText?: string;
  dairyFree?: boolean;
  gaps?: string;
  glutenFree?: boolean;
  instructions?: string;
  ketogenic?: boolean;
  lowFodmap?: boolean;
  occasions?: string[];
  sustainable?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  veryHealthy?: boolean;
  veryPopular?: boolean;
  whole30?: boolean;
  weightWatcherSmartPoints?: number;
  dishTypes?: string[];
  extendedIngredients?: Ingredient[];
  summary?: string;
  cuisines?: string[];
  diets?: string[];
  nutrition?: Nutrition;
  analyzedInstructions?: AnalyzedInstruction[];
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  unitShort?: string;
  unitLong?: string;
  originalString?: string;
  metaInformation?: string[];
}

export interface Nutrition {
  nutrients: Nutrient[];
  properties?: any[];
  flavonoids?: any[];
  ingredients?: any[];
  caloricBreakdown?: any;
  weightPerServing?: any;
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients?: any[];
  equipment?: any[];
  length?: any;
}

export interface SearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  equipment?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;
  instructionsRequired?: boolean;
  fillIngredients?: boolean;
  addRecipeInformation?: boolean;
  addRecipeNutrition?: boolean;
  author?: string;
  tags?: string;
  number?: number;
  maxReadyTime?: number;
  sort?: string;
  sortDirection?: string;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minFat?: number;
  maxFat?: number;
  minCarbs?: number;
  maxCarbs?: number;
}

export interface SearchByIngredientsParams {
  number?: number;
  ranking?: number;
  ignorePantry?: boolean;
}

export interface SearchResult {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

// Spoonacular API Configuration
const API_KEY = "7897add7a2144cd7a1028ab589f205af";
const BASE_URL = "https://api.spoonacular.com";

// Helper function to build API URLs with parameters
const buildUrl = (endpoint: string, params: Record<string, any>): string => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add API key
  url.searchParams.append("apiKey", API_KEY);
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.toString();
};

// Search recipes by query and filters
export const searchRecipes = async (params: SearchParams): Promise<SearchResult> => {
  try {
    const url = buildUrl("/recipes/complexSearch", params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as SearchResult;
  } catch (error) {
    console.error("Error searching recipes:", error);
    // Return empty results to avoid breaking the app
    return { results: [], offset: 0, number: 0, totalResults: 0 };
  }
};

// Search recipes by ingredients
export const searchRecipesByIngredients = async (
  ingredients: string[],
  params: SearchByIngredientsParams = {}
): Promise<Recipe[]> => {
  try {
    const url = buildUrl("/recipes/findByIngredients", {
      ...params,
      ingredients: ingredients.join(","),
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Recipe[];
  } catch (error) {
    console.error("Error searching recipes by ingredients:", error);
    return [];
  }
};

// Get recipe details by ID
export const getRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const url = buildUrl(`/recipes/${id}/information`, {
      includeNutrition: true,
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Recipe;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw new Error(`Failed to fetch recipe ${id}`);
  }
};
