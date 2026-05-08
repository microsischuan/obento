export type SectionType =
  | "Main"
  | "Protein"
  | "Veg"
  | "Fruit"
  | "Snack"
  | "Treat"
  | "Dip"
  | "Side"
  | "Center";

export type Ingredient = {
  name: string;
  qty: string;
  done?: boolean;
};

export type Dish = {
  name: string;
  section: SectionType | string;
  ingredients: Ingredient[];
};

export type BentoSection = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: SectionType | string;
  round?: boolean;
};

export type DividerDef = {
  type: "v" | "h";
  between: [number | number[], number | number[]];
  x?: number;
  y?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
};

export type LayoutTemplate = {
  name: string;
  desc: string;
  sections: BentoSection[];
  dividers: DividerDef[];
};

export type Layer = {
  templateIdx: number;
  sections: BentoSection[];
  dishes: Record<string, Dish>;
};

export type Plan = {
  id: number;
  isoDate: string;
  label: string;
  layers: Layer[];
};

export type PlannerStep = "layout" | "dishes" | "review" | "schedule";
export type TabKey = "planner" | "saved" | "morning";
