import { useEffect, useMemo, useState } from "react";
import { cloneSections, layoutTemplates } from "./layouts";
import type { Layer, Plan } from "./types";

const STORAGE_KEY = "obento-plans-v1";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const TODAY = todayIso();

function initialPlans(): Plan[] {
  return [
    {
      id: 1,
      isoDate: TODAY,
      label: "Mia",
      layers: [
        {
          templateIdx: 3,
          sections: cloneSections(layoutTemplates[3].sections),
          dishes: {
            "0": { name: "Meatballs", section: "Main", ingredients: [{ name: "Ground beef", qty: "200g" }] },
            "1": { name: "Broccoli", section: "Veg", ingredients: [{ name: "Broccoli florets", qty: "1 cup" }] },
            "2": { name: "Cashews", section: "Snack", ingredients: [] },
            "3": { name: "Raspberries", section: "Fruit", ingredients: [{ name: "Raspberries", qty: "1/2 cup" }] },
            "4": { name: "Sweet potato", section: "Treat", ingredients: [{ name: "Sweet potato", qty: "1 small" }] },
          },
        },
      ],
    },
    {
      id: 2,
      isoDate: TODAY,
      label: "Leo",
      layers: [
        {
          templateIdx: 1,
          sections: cloneSections(layoutTemplates[1].sections),
          dishes: {
            "0": { name: "Onigiri", section: "Main", ingredients: [{ name: "Cooked rice", qty: "1 cup" }] },
            "1": { name: "Edamame", section: "Protein", ingredients: [{ name: "Frozen edamame", qty: "80g" }] },
            "2": { name: "Grapes", section: "Fruit", ingredients: [] },
          },
        },
      ],
    },
    {
      id: 3,
      isoDate: addDays(TODAY, 2),
      label: "Mia",
      layers: [
        {
          templateIdx: 2,
          sections: cloneSections(layoutTemplates[2].sections),
          dishes: {
            "0": { name: "Tamagoyaki", section: "Main", ingredients: [{ name: "Eggs", qty: "3" }] },
            "1": { name: "Crackers", section: "Snack", ingredients: [] },
            "2": { name: "Strawberries", section: "Fruit", ingredients: [{ name: "Strawberries", qty: "5" }] },
            "3": { name: "Cookie", section: "Treat", ingredients: [] },
          },
        },
      ],
    },
  ];
}

export function makeLayer(templateIdx = 0): Layer {
  return { templateIdx, sections: cloneSections(layoutTemplates[templateIdx].sections), dishes: {} };
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPlans();
    try {
      return JSON.parse(raw) as Plan[];
    } catch {
      return initialPlans();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const api = useMemo(
    () => ({
      plans,
      setPlans,
      addPlan: (plan: Plan) => setPlans((p) => [plan, ...p]),
      removePlan: (id: number) => setPlans((p) => p.filter((x) => x.id !== id)),
      upsertPlan: (next: Plan) =>
        setPlans((p) => {
          const i = p.findIndex((x) => x.id === next.id);
          if (i < 0) return [next, ...p];
          const copy = [...p];
          copy[i] = next;
          return copy;
        }),
    }),
    [plans],
  );

  return api;
}

export const dateUtils = { TODAY, todayIso, addDays };
