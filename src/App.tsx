import { ChevronRight, ListChecks, Soup } from "lucide-react";
import { useMemo, useState } from "react";
import BentoSvg from "./components/BentoSvg";
import ConfirmModal from "./components/ConfirmModal";
import DishModal from "./components/DishModal";
import Topbar from "./components/Topbar";
import { cloneSections, layoutTemplates } from "./lib/layouts";
import { dateUtils, makeLayer, usePlans } from "./lib/storage";
import type { Ingredient, Layer, Plan, PlannerStep, TabKey } from "./lib/types";
import DayView from "./screens/DayView";
import MorningScreen from "./screens/MorningScreen";
import PlannerScreen from "./screens/PlannerScreen";
import SavedScreen from "./screens/SavedScreen";

function fmtDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function fmtDateLong(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function collectDishNames(plan: Plan) {
  return plan.layers.flatMap((l) => Object.values(l.dishes).map((d) => d.name));
}

function avatarFor(label: string, idx: number) {
  const colors = ["#7a9e8e", "#c17f5a", "#9e7ab8", "#5a8ec1", "#b89e5a"];
  return { color: colors[idx % colors.length], initial: label ? label[0].toUpperCase() : "#" };
}

export default function App() {
  const { plans, addPlan, removePlan } = usePlans();
  const [tab, setTab] = useState<TabKey>("planner");
  const [dayView, setDayView] = useState<string | null>(null);
  const [step, setStep] = useState<PlannerStep>("layout");
  const [layers, setLayers] = useState<Layer[]>([makeLayer(0)]);
  const [planDate, setPlanDate] = useState(dateUtils.addDays(dateUtils.TODAY, 1));
  const [planLabel, setPlanLabel] = useState("");
  const [expandedBentos, setExpandedBentos] = useState<Set<number>>(new Set());

  const [editingCell, setEditingCell] = useState<{ layerIdx: number; sectionIdx: number } | null>(null);
  const [dishName, setDishName] = useState("");
  const [dishSection, setDishSection] = useState("Main");
  const [editingIngredients, setEditingIngredients] = useState<Ingredient[]>([{ name: "", qty: "" }, { name: "", qty: "" }, { name: "", qty: "" }]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{ title: string; text: string; onConfirm: () => void }>({
    title: "",
    text: "",
    onConfirm: () => undefined,
  });

  const today = dateUtils.TODAY;
  const tomorrow = dateUtils.addDays(today, 1);
  const editingDish = useMemo(() => {
    if (!editingCell) return null;
    return layers[editingCell.layerIdx]?.dishes[String(editingCell.sectionIdx)] ?? null;
  }, [editingCell, layers]);

  const goStep = (next: PlannerStep) => {
    setStep(next);
    if (next === "schedule") {
      setPlanDate(dateUtils.addDays(today, 1));
      setPlanLabel("");
    }
  };

  const openDishModal = (layerIdx: number, sectionIdx: number) => {
    const layer = layers[layerIdx];
    const section = layer.sections[sectionIdx];
    const dish = layer.dishes[String(sectionIdx)];
    setEditingCell({ layerIdx, sectionIdx });
    setDishName(dish?.name ?? "");
    setDishSection(dish?.section || section.type || section.label);
    setEditingIngredients(dish?.ingredients?.length ? structuredClone(dish.ingredients) : [{ name: "", qty: "" }, { name: "", qty: "" }, { name: "", qty: "" }]);
  };

  const closeDishModal = () => setEditingCell(null);

  const saveDish = () => {
    if (!editingCell) return;
    const name = dishName.trim();
    if (!name) return alert("Please enter a dish name");
    setLayers((prev) => {
      const next = structuredClone(prev) as Layer[];
      const layer = next[editingCell.layerIdx];
      const ingr = editingIngredients.filter((i) => i.name.trim()).map((i) => ({ name: i.name.trim(), qty: i.qty.trim() }));
      layer.dishes[String(editingCell.sectionIdx)] = { name, section: dishSection, ingredients: ingr };
      return next;
    });
    closeDishModal();
  };

  const deleteDish = () => {
    if (!editingCell) return;
    setLayers((prev) => {
      const next = structuredClone(prev) as Layer[];
      delete next[editingCell.layerIdx].dishes[String(editingCell.sectionIdx)];
      return next;
    });
    closeDishModal();
  };

  const savePlan = () => {
    if (!planDate) return alert("Please pick a date");
    addPlan({ id: Date.now(), isoDate: planDate, label: planLabel.trim(), layers: structuredClone(layers) });
    alert(`Bento saved for ${fmtDate(planDate)}${planLabel ? ` (${planLabel})` : ""} 🍱`);
    setLayers([makeLayer(0)]);
    setStep("layout");
    setTab("saved");
  };

  const newPlan = () => {
    setLayers([makeLayer(0)]);
    setStep("layout");
    setTab("planner");
    setDayView(null);
  };

  const confirmDelete = (id: number) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    const desc = `${plan.label ? `${plan.label}'s bento` : "This bento"} for ${fmtDate(plan.isoDate)}`;
    setConfirmState({
      title: "Delete this bento?",
      text: `${desc} will be permanently removed.`,
      onConfirm: () => removePlan(id),
    });
    setConfirmOpen(true);
  };

  const loadPlan = (id: number) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    setLayers(structuredClone(plan.layers));
    setTab("planner");
    goStep("dishes");
  };

  const renderFolder = (plan: Plan, idx: number, autoExpand: boolean) => {
    const names = collectDishNames(plan).join(" · ");
    const av = avatarFor(plan.label, idx);
    const expanded = autoExpand || expandedBentos.has(plan.id);
    const dishesWithIngr = plan.layers.flatMap((layer) => Object.values(layer.dishes).filter((d) => d.ingredients.length));
    return (
      <div key={plan.id} className={`mb-2.5 overflow-hidden rounded-[14px] border bg-white ${expanded ? "border-[#b8d0c5]" : "border-[#e0dcd4]"}`}>
        <button
          type="button"
          className={`flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-all hover:bg-[#e8f0ec] ${expanded ? "border-b border-dashed border-[#e0dcd4] bg-[#e8f0ec]" : ""}`}
          onClick={() =>
            setExpandedBentos((prev) => {
              const next = new Set(prev);
              if (next.has(plan.id)) next.delete(plan.id);
              else next.add(plan.id);
              return next;
            })
          }
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-sm font-medium text-white" style={{ background: av.color }}>
              {plan.label ? av.initial : <Soup className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{plan.label || `Bento ${idx + 1}`}</div>
              <div className="max-w-[280px] truncate text-xs text-[#6b6a66]">{names || "No dishes"}</div>
            </div>
          </div>
          <ChevronRight className={`h-4 w-4 text-[#9a9890] transition-transform ${expanded ? "rotate-90 text-[#7a9e8e]" : ""}`} />
        </button>
        {expanded && (
          <div className="px-4 pb-4 pt-3.5">
            {plan.layers.map((layer, li) => (
              <div key={li} className="mb-2.5">
                {plan.layers.length > 1 && <div className="mb-1 text-[11px] uppercase tracking-[0.5px] text-[#9a9890]">Layer {li + 1}</div>}
                <div className="rounded-xl bg-white">
                  <BentoSvg layer={layer} layerIdx={li} />
                </div>
              </div>
            ))}
            {!!dishesWithIngr.length && (
              <>
                <div className="mb-2 mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-[#9a9890]">
                  <ListChecks className="h-3.5 w-3.5" />
                  Prep list
                </div>
                <div className="space-y-2">
                  {dishesWithIngr.map((d, i) => (
                    <div key={`${d.name}-${i}`} className="rounded-[10px] bg-[#f5f2ed] px-3.5 py-3">
                      <div className="mb-2 flex items-center gap-2 text-[13px] font-medium">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ background: ["#7a9e8e", "#c17f5a", "#9e7ab8", "#5a8ec1", "#b89e5a"][i % 5] }}
                        />
                        {d.name}
                        <span className="text-[11px] font-normal text-[#9a9890]">· {d.section}</span>
                      </div>
                      <div className="space-y-1">
                        {d.ingredients.map((ing, j) => (
                          <label key={j} className="flex items-center gap-2 text-[13px]">
                            <input type="checkbox" className="h-4 w-4 accent-[#7a9e8e]" />
                            <span className="flex-1">{ing.name}</span>
                            <span className="text-xs text-[#6b6a66]">{ing.qty}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] p-5 text-[#2a2a28]">
      <div className="mx-auto flex min-h-[640px] max-w-[700px] flex-col overflow-hidden rounded-[18px] border border-[#e0dcd4] bg-white">
        <Topbar
          tab={tab}
          onTabChange={(next) => {
            setDayView(null);
            setTab(next);
            if (next === "morning") setExpandedBentos(new Set());
          }}
        />

        {tab === "planner" && (
          <PlannerScreen
            layers={layers}
            step={step}
            planDate={planDate}
            planLabel={planLabel}
            onChangeStep={goStep}
            onAddLayer={() => setLayers((p) => [...p, makeLayer(0)])}
            onRemoveLayer={(idx) => setLayers((p) => p.filter((_, i) => i !== idx))}
            onSelectTemplate={(layerIdx, templateIdx) =>
              setLayers((prev) =>
                prev.map((l, i) =>
                  i === layerIdx ? { templateIdx, sections: cloneSections(layoutTemplates[templateIdx].sections), dishes: {} } : l,
                ),
              )
            }
            onOpenDishModal={openDishModal}
            onLayerChange={(layerIdx, nextLayer) => setLayers((prev) => prev.map((l, i) => (i === layerIdx ? nextLayer : l)))}
            onChangeDate={setPlanDate}
            onChangeLabel={setPlanLabel}
            onSavePlan={savePlan}
          />
        )}

        {tab === "saved" && !dayView && (
          <SavedScreen plans={plans} today={today} tomorrow={tomorrow} fmtDate={fmtDate} onLoadPlan={loadPlan} onDeletePlan={confirmDelete} onNewPlan={newPlan} />
        )}

        {tab === "morning" && !dayView && (
          <MorningScreen
            today={today}
            plans={plans}
            fmtDate={fmtDate}
            fmtDateLong={fmtDateLong}
            collectDishNames={collectDishNames}
            renderFolder={renderFolder}
            onNewPlan={newPlan}
            onSwitchSaved={() => setTab("saved")}
            onOpenDay={(isoDate) => {
              setExpandedBentos(new Set());
              setDayView(isoDate);
            }}
          />
        )}

        {tab === "morning" && dayView && (
          <DayView
            isoDate={dayView}
            today={today}
            plans={plans.filter((p) => p.isoDate === dayView)}
            fmtDateLong={fmtDateLong}
            renderFolder={renderFolder}
            onBack={() => setDayView(null)}
          />
        )}
      </div>

      <DishModal
        open={!!editingCell}
        sectionName={
          editingCell
            ? `Layer ${editingCell.layerIdx + 1} · ${(editingDish?.section || layers[editingCell.layerIdx].sections[editingCell.sectionIdx].label).toUpperCase()}`
            : "Section"
        }
        name={dishName}
        section={dishSection}
        ingredients={editingIngredients}
        showDelete={!!editingDish}
        onChangeName={setDishName}
        onChangeSection={setDishSection}
        onChangeIngredient={(idx, patch) =>
          setEditingIngredients((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], ...patch };
            return next;
          })
        }
        onAddIngredient={() => setEditingIngredients((prev) => [...prev, { name: "", qty: "" }])}
        onRemoveIngredient={(idx) =>
          setEditingIngredients((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            return next.length ? next : [{ name: "", qty: "" }];
          })
        }
        onClose={closeDishModal}
        onSave={saveDish}
        onDelete={deleteDish}
      />

      <ConfirmModal
        open={confirmOpen}
        title={confirmState.title}
        text={confirmState.text}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmState.onConfirm();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
