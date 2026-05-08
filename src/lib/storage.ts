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
  return [];
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
