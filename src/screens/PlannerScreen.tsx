import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  GripHorizontal,
  Info,
  ListChecks,
  Plus,
  Soup,
  Layers,
  Trash2,
} from "lucide-react";
import BentoSvg from "../components/BentoSvg";
import { layoutTemplates } from "../lib/layouts";
import type { Ingredient, Layer, PlannerStep } from "../lib/types";

type Props = {
  layers: Layer[];
  step: PlannerStep;
  planDate: string;
  planLabel: string;
  onChangeStep: (step: PlannerStep) => void;
  onAddLayer: () => void;
  onRemoveLayer: (idx: number) => void;
  onSelectTemplate: (layerIdx: number, templateIdx: number) => void;
  onOpenDishModal: (layerIdx: number, sectionIdx: number) => void;
  onLayerChange: (layerIdx: number, nextLayer: Layer) => void;
  onChangeDate: (value: string) => void;
  onChangeLabel: (value: string) => void;
  onSavePlan: () => void;
};

function collectDishes(layers: Layer[]) {
  const out: Array<{ name: string; section: string; ingredients: Ingredient[] }> = [];
  layers.forEach((layer) => Object.values(layer.dishes).forEach((d) => out.push(d)));
  return out;
}

function StepIndicator({ step }: { step: PlannerStep }) {
  const idx = ["layout", "dishes", "review", "schedule"].indexOf(step);
  const labels = ["Layout", "Dishes", "Review", "Save"];
  return (
    <div className="mb-5 flex items-center gap-2">
      {labels.map((label, i) => (
        <div key={label} className="contents">
          <div className={`flex items-center gap-1.5 text-xs ${i === idx ? "font-medium text-[#5d8474]" : i < idx ? "text-[#6b6a66]" : "text-[#9a9890]"}`}>
            <div
              className={[
                "flex h-[22px] w-[22px] items-center justify-center rounded-full border text-[11px]",
                i === idx
                  ? "border-[#7a9e8e] bg-[#7a9e8e] text-white"
                  : i < idx
                    ? "border-[#b8d0c5] bg-[#b8d0c5] text-white"
                    : "border-[#e0dcd4] text-[#9a9890]",
              ].join(" ")}
            >
              {i < idx ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            {label}
          </div>
          {i < labels.length - 1 && <div className="h-px flex-1 bg-[#e0dcd4]" />}
        </div>
      ))}
    </div>
  );
}

export default function PlannerScreen(props: Props) {
  const dishesWithIngr = collectDishes(props.layers).filter((d) => d.ingredients.length);
  return (
    <div className="flex-1 p-5">
      <StepIndicator step={props.step} />
      {props.step === "layout" && (
        <>
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-[#9a9890]">
            <Layers className="h-3.5 w-3.5" />
            Layers
          </div>
          <div className="mb-3.5 flex flex-col gap-3">
            {props.layers.map((layer, li) => (
              <div key={li} className="overflow-hidden rounded-[14px] border border-[#e0dcd4] bg-white">
                <div className="flex items-center justify-between border-b border-[#e0dcd4] bg-[#f5f2ed] px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium">
                    <Layers className="h-3.5 w-3.5" /> Layer {li + 1}
                  </div>
                  {props.layers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => props.onRemoveLayer(li)}
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-md text-[#9a9890] hover:bg-white hover:text-[#c17f5a]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {layoutTemplates.map((tmpl, ti) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => props.onSelectTemplate(li, ti)}
                        className={[
                          "rounded-[10px] border bg-white p-2.5 text-left transition-all",
                          layer.templateIdx === ti
                            ? "border-2 border-[#7a9e8e] bg-[#e8f0ec]"
                            : "border-[#e0dcd4] hover:border-[#7a9e8e]",
                        ].join(" ")}
                      >
                        <svg className="block h-14 w-full" viewBox="0 0 110 56">
                          <rect x="0.5" y="0.5" width="109" height="55" rx="6" fill="#f7f4ef" stroke="#d8d0c4" />
                          {tmpl.sections.map((s, i) =>
                            s.round ? (
                              <circle key={i} cx={s.x * 110 + (s.w * 110) / 2} cy={s.y * 56 + (s.h * 56) / 2} r={Math.min(s.w * 110, s.h * 56) / 2 - 2} fill="#b8d0c5" opacity="0.7" />
                            ) : (
                              <rect key={i} x={s.x * 110 + 2} y={s.y * 56 + 2} width={s.w * 110 - 4} height={s.h * 56 - 4} rx="3" fill="#b8d0c5" opacity="0.6" />
                            ),
                          )}
                        </svg>
                        <div className="mt-1.5 text-center text-[11px] text-[#6b6a66]">
                          <div className="text-xs font-medium text-[#2a2a28]">{tmpl.name}</div>
                          {tmpl.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={props.onAddLayer}
            className="flex w-full items-center justify-center gap-1.5 rounded-[14px] border-2 border-dashed border-[#e0dcd4] bg-transparent p-3 text-[13px] text-[#6b6a66] transition-all hover:border-[#7a9e8e] hover:bg-[#e8f0ec] hover:text-[#5d8474]"
          >
            <Plus className="h-3.5 w-3.5" /> Add another layer
          </button>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-xs text-[#9a9890]">
              <Info className="h-3.5 w-3.5" />
              You can resize sections in the next step
            </span>
            <button
              type="button"
              onClick={() => props.onChangeStep("dishes")}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#7a9e8e] bg-[#7a9e8e] px-4 py-2 text-[13px] text-white hover:border-[#5d8474] hover:bg-[#5d8474]"
            >
              Next: Add dishes <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}

      {props.step === "dishes" && (
        <>
          <div className="mb-2 flex items-center gap-1 text-[11px] text-[#9a9890]">
            <GripHorizontal className="h-3.5 w-3.5" />
            Tap a section to add a dish · drag dividers to resize
          </div>
          {props.layers.map((layer, li) => (
            <div key={li} className="mb-3">
              {props.layers.length > 1 && (
                <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-[#9a9890]">Layer {li + 1}</div>
              )}
              <div className="rounded-xl bg-white p-2">
                <BentoSvg layer={layer} layerIdx={li} editable onSectionClick={props.onOpenDishModal} onLayerChange={props.onLayerChange} />
              </div>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => props.onChangeStep("layout")}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-1.5 text-xs hover:bg-[#f5f2ed]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => props.onChangeStep("review")}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#7a9e8e] bg-[#7a9e8e] px-4 py-2 text-[13px] text-white hover:border-[#5d8474] hover:bg-[#5d8474]"
            >
              Review bento <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}

      {props.step === "review" && (
        <>
          <div className="mb-4 rounded-[14px] bg-[#e8f0ec] p-[18px]">
            <div className="mb-1 flex items-center gap-1.5 text-[15px] font-medium">
              <Soup className="h-4 w-4" /> Looking good!
            </div>
            <div className="text-xs text-[#6b6a66]">Take one last look before scheduling.</div>
          </div>
          {props.layers.map((layer, li) => (
            <div key={li} className="mb-3">
              {props.layers.length > 1 && <div className="mb-1 text-[11px] uppercase tracking-[0.5px] text-[#9a9890]">Layer {li + 1}</div>}
              <div className="rounded-[14px] border border-[#e0dcd4] bg-white p-4">
                <BentoSvg layer={layer} layerIdx={li} />
              </div>
            </div>
          ))}
          {!!dishesWithIngr.length && (
            <>
              <div className="mb-2 mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-[#9a9890]">
                <ListChecks className="h-3.5 w-3.5" />
                Ingredients you'll need
              </div>
              <div className="space-y-2">
                {dishesWithIngr.map((dish, i) => (
                  <div key={`${dish.name}-${i}`} className="rounded-[10px] bg-[#f5f2ed] px-3.5 py-3">
                    <div className="mb-2 flex items-center gap-2 text-[13px] font-medium">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: ["#7a9e8e", "#c17f5a", "#9e7ab8", "#5a8ec1", "#b89e5a"][i % 5] }}
                      />
                      {dish.name}
                      <span className="text-[11px] font-normal text-[#9a9890]">· {dish.section}</span>
                    </div>
                    <div className="space-y-1">
                      {dish.ingredients.map((ing, j) => (
                        <div key={j} className="flex items-center gap-2 text-[13px]">
                          <input type="checkbox" disabled className="h-4 w-4 accent-[#7a9e8e]" />
                          <div className="flex-1">{ing.name}</div>
                          <div className="text-xs text-[#6b6a66]">{ing.qty}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="mt-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => props.onChangeStep("dishes")}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-1.5 text-xs hover:bg-[#f5f2ed]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={() => props.onChangeStep("schedule")}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#7a9e8e] bg-[#7a9e8e] px-4 py-2 text-[13px] text-white hover:border-[#5d8474] hover:bg-[#5d8474]"
            >
              Looks good <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}

      {props.step === "schedule" && (
        <>
          <div className="mb-4 rounded-[14px] bg-[#e8f0ec] p-[18px]">
            <div className="mb-1 flex items-center gap-1.5 text-[15px] font-medium">
              <CalendarDays className="h-4 w-4" /> When is this for?
            </div>
            <div className="text-xs text-[#6b6a66]">Pick the date this bento will be packed for.</div>
          </div>
          <div className="mb-3 rounded-[14px] border border-[#e0dcd4] bg-white p-4">
            <div className="mb-[14px]">
              <label className="mb-1.5 block text-xs text-[#6b6a66]">Date</label>
              <input
                type="date"
                value={props.planDate}
                onChange={(e) => props.onChangeDate(e.target.value)}
                className="w-full rounded-lg border border-[#e0dcd4] bg-[#f5f2ed] px-3 py-2.5 text-[13px] outline-none focus:border-[#7a9e8e] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-[#6b6a66]">
                Whose bento? <span className="font-normal text-[#9a9890]">(optional — useful if multiple kids)</span>
              </label>
              <input
                value={props.planLabel}
                onChange={(e) => props.onChangeLabel(e.target.value)}
                placeholder="e.g. Mia, Leo, or just 'school'"
                className="w-full rounded-lg border border-[#e0dcd4] bg-[#f5f2ed] px-3 py-2.5 text-[13px] outline-none focus:border-[#7a9e8e] focus:bg-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => props.onChangeStep("review")}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-1.5 text-xs hover:bg-[#f5f2ed]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={props.onSavePlan}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#7a9e8e] bg-[#7a9e8e] px-4 py-2 text-[13px] text-white hover:border-[#5d8474] hover:bg-[#5d8474]"
            >
              <Check className="h-3.5 w-3.5" /> Save plan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
