import type { BentoSection, LayoutTemplate } from "./types";

export const layoutTemplates: LayoutTemplate[] = [
  {
    name: "2-section",
    desc: "Left & right",
    sections: [
      { label: "Main", x: 0, y: 0, w: 0.55, h: 1, type: "Main" },
      { label: "Side", x: 0.55, y: 0, w: 0.45, h: 1, type: "Side" },
    ],
    dividers: [{ type: "v", between: [0, 1], x: 0.55 }],
  },
  {
    name: "3-section",
    desc: "1 large + 2 stacked",
    sections: [
      { label: "Main", x: 0, y: 0, w: 0.55, h: 1, type: "Main" },
      { label: "Protein", x: 0.55, y: 0, w: 0.45, h: 0.5, type: "Protein" },
      { label: "Fruit", x: 0.55, y: 0.5, w: 0.45, h: 0.5, type: "Fruit" },
    ],
    dividers: [
      { type: "v", between: [0, [1, 2]], x: 0.55 },
      { type: "h", between: [1, 2], y: 0.5, xMin: 0.55, xMax: 1 },
    ],
  },
  {
    name: "Classic 4",
    desc: "2x2 grid",
    sections: [
      { label: "Main", x: 0, y: 0, w: 0.55, h: 0.55, type: "Main" },
      { label: "Side", x: 0.55, y: 0, w: 0.45, h: 0.55, type: "Side" },
      { label: "Snack", x: 0, y: 0.55, w: 0.5, h: 0.45, type: "Snack" },
      { label: "Fruit", x: 0.5, y: 0.55, w: 0.5, h: 0.45, type: "Fruit" },
    ],
    dividers: [
      { type: "v", between: [0, 1], x: 0.55, yMin: 0, yMax: 0.55 },
      { type: "v", between: [2, 3], x: 0.5, yMin: 0.55, yMax: 1 },
      { type: "h", between: [[0, 1], [2, 3]], y: 0.55 },
    ],
  },
  {
    name: "Bentgo 5",
    desc: "Center + 4 around",
    sections: [
      { label: "Main", x: 0, y: 0, w: 0.55, h: 1, type: "Main" },
      { label: "Veg", x: 0.55, y: 0, w: 0.45, h: 0.4, type: "Veg" },
      { label: "Center", x: 0.55, y: 0.4, w: 0.225, h: 0.3, type: "Snack", round: true },
      { label: "Fruit", x: 0.775, y: 0.4, w: 0.225, h: 0.3, type: "Fruit" },
      { label: "Treat", x: 0.55, y: 0.7, w: 0.45, h: 0.3, type: "Treat" },
    ],
    dividers: [],
  },
  {
    name: "4-section",
    desc: "1 big + 3 small",
    sections: [
      { label: "Main", x: 0, y: 0, w: 0.6, h: 1, type: "Main" },
      { label: "Protein", x: 0.6, y: 0, w: 0.4, h: 0.34, type: "Protein" },
      { label: "Veg", x: 0.6, y: 0.34, w: 0.4, h: 0.33, type: "Veg" },
      { label: "Fruit", x: 0.6, y: 0.67, w: 0.4, h: 0.33, type: "Fruit" },
    ],
    dividers: [{ type: "v", between: [0, [1, 2, 3]], x: 0.6 }],
  },
  {
    name: "Single tray",
    desc: "No dividers",
    sections: [{ label: "Main", x: 0, y: 0, w: 1, h: 1, type: "Main" }],
    dividers: [],
  },
];

export function cloneSections(sections: BentoSection[]): BentoSection[] {
  return sections.map((s) => ({ ...s }));
}
