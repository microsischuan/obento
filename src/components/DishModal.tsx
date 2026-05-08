import { Check, Plus, Trash2, UtensilsCrossed, X } from "lucide-react";
import type { Ingredient, SectionType } from "../lib/types";

type Props = {
  open: boolean;
  sectionName: string;
  name: string;
  section: string;
  ingredients: Ingredient[];
  showDelete: boolean;
  onChangeName: (value: string) => void;
  onChangeSection: (value: string) => void;
  onChangeIngredient: (idx: number, patch: Partial<Ingredient>) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (idx: number) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

const options: SectionType[] = ["Main", "Protein", "Veg", "Fruit", "Snack", "Treat", "Dip", "Side"];

export default function DishModal(props: Props) {
  if (!props.open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(40,50,45,0.35)] p-5 backdrop-blur-[4px]">
      <div className="max-h-[90vh] w-full max-w-[380px] overflow-y-auto rounded-[20px] border border-[#e0dcd4] bg-white">
        <div className="flex items-center gap-2.5 bg-[#e8f0ec] px-5 pb-4 pt-[18px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-[#5d8474]">
            <UtensilsCrossed className="h-[18px] w-[18px]" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.6px] text-[#5d8474]">{props.sectionName}</div>
            <h3 className="text-[15px] font-medium">Add a dish</h3>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-[14px] flex gap-2.5">
            <div className="flex-[1.5]">
              <label className="mb-1.5 block text-xs text-[#6b6a66]">Dish name</label>
              <input
                className="w-full rounded-lg border border-[#e0dcd4] bg-[#f5f2ed] px-3 py-2.5 text-[13px] outline-none focus:border-[#7a9e8e] focus:bg-white"
                value={props.name}
                onChange={(e) => props.onChangeName(e.target.value)}
                placeholder="e.g. Tamagoyaki"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs text-[#6b6a66]">Section type</label>
              <select
                className="w-full rounded-lg border border-[#e0dcd4] bg-[#f5f2ed] px-3 py-2.5 text-[13px] outline-none focus:border-[#7a9e8e] focus:bg-white"
                value={props.section}
                onChange={(e) => props.onChangeSection(e.target.value)}
              >
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-[#6b6a66]">
              Ingredients <span className="font-normal text-[#9a9890]">(optional)</span>
            </label>
            <div className="flex flex-col gap-1.5">
              {props.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    className="flex-[1.6] rounded-lg border border-[#e0dcd4] bg-[#f5f2ed] px-3 py-2 text-[13px] outline-none focus:border-[#7a9e8e] focus:bg-white"
                    placeholder="Ingredient"
                    value={ing.name}
                    onChange={(e) => props.onChangeIngredient(i, { name: e.target.value })}
                  />
                  <input
                    className="flex-1 rounded-lg border border-[#e0dcd4] bg-[#f5f2ed] px-3 py-2 text-[13px] outline-none focus:border-[#7a9e8e] focus:bg-white"
                    placeholder="Quantity"
                    value={ing.qty}
                    onChange={(e) => props.onChangeIngredient(i, { qty: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => props.onRemoveIngredient(i)}
                    className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md text-[#9a9890] hover:bg-[#f5f2ed] hover:text-[#c17f5a]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={props.onAddIngredient}
              className="mt-1.5 inline-flex items-center gap-1 py-1.5 text-xs text-[#5d8474] hover:text-[#7a9e8e]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add ingredient
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-5 pb-[18px] pt-3">
          <div>
            {props.showDelete && (
              <button
                type="button"
                onClick={props.onDelete}
                className="inline-flex items-center gap-1 rounded-[9px] border border-transparent px-3 py-1.5 text-xs text-[#c17f5a] hover:bg-[#f5ede6]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-1.5 text-xs hover:bg-[#f5f2ed]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={props.onSave}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#7a9e8e] bg-[#7a9e8e] px-3 py-1.5 text-xs text-white hover:border-[#5d8474] hover:bg-[#5d8474]"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
