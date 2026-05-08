import { BookmarkX, Layers, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { layoutTemplates } from "../lib/layouts";
import type { Plan } from "../lib/types";

type Props = {
  plans: Plan[];
  today: string;
  tomorrow: string;
  fmtDate: (iso: string) => string;
  onLoadPlan: (id: number) => void;
  onDeletePlan: (id: number) => void;
  onNewPlan: () => void;
};

function miniSvg(templateIdx: number, w = 36, h = 24) {
  const tmpl = layoutTemplates[templateIdx];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} rx="3" fill="#f7f4ef" stroke="#d8d0c4" />
      {tmpl.sections.map((s, i) =>
        s.round ? (
          <circle key={i} cx={s.x * w + (s.w * w) / 2} cy={s.y * h + (s.h * h) / 2} r={Math.min(s.w * w, s.h * h) / 2 - 1} fill="#b8d0c5" opacity="0.7" />
        ) : (
          <rect key={i} x={s.x * w + 1.5} y={s.y * h + 1.5} width={s.w * w - 3} height={s.h * h - 3} rx="2" fill="#b8d0c5" opacity="0.7" />
        ),
      )}
    </svg>
  );
}

function collectDishNames(plan: Plan) {
  return plan.layers.flatMap((l) => Object.values(l.dishes).map((d) => d.name));
}

export default function SavedScreen({ plans, today, tomorrow, fmtDate, onLoadPlan, onDeletePlan, onNewPlan }: Props) {
  const sorted = [...plans].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  return (
    <div className="flex-1 p-5">
      <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-[#9a9890]">
        <UtensilsCrossed className="h-3.5 w-3.5" />
        Your bentos
      </div>
      <div className="flex flex-col gap-2">
        {!sorted.length && (
          <div className="mb-4 rounded-[14px] bg-[#e8f0ec] px-5 py-7 text-center">
            <div className="mb-2.5 text-[#7a9e8e]">
              <BookmarkX className="mx-auto h-9 w-9" />
            </div>
            <div className="mb-1 text-sm font-medium">No saved bentos yet</div>
            <div className="text-[13px] text-[#6b6a66]">Plan one and it'll show up here.</div>
          </div>
        )}
        {sorted.map((plan) => {
          const names = collectDishNames(plan);
          const dateLabel =
            plan.isoDate === today ? `Today · ${fmtDate(plan.isoDate)}` : plan.isoDate === tomorrow ? `Tomorrow · ${fmtDate(plan.isoDate)}` : fmtDate(plan.isoDate);
          return (
            <div key={plan.id} className="flex items-center gap-3.5 rounded-[14px] border border-[#e0dcd4] bg-white px-4 py-3.5 transition-all hover:border-[#7a9e8e]">
              <button type="button" className="flex shrink-0 cursor-pointer flex-col gap-[3px]" onClick={() => onLoadPlan(plan.id)}>
                {plan.layers.map((layer, i) => (
                  <span key={i}>{miniSvg(layer.templateIdx)}</span>
                ))}
              </button>
              <button type="button" className="min-w-0 flex-1 cursor-pointer text-left" onClick={() => onLoadPlan(plan.id)}>
                <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                  {dateLabel}
                  {plan.label && <span className="rounded-xl bg-[#f0e8f5] px-2 py-0.5 text-[11px] font-medium text-[#9e7ab8]">{plan.label}</span>}
                </div>
                <div className="mt-0.5 truncate text-xs text-[#6b6a66]">{names.join(" · ") || "No dishes"}</div>
                <div className="mt-1 flex gap-2.5 text-[11px] text-[#9a9890]">
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {plan.layers.length} layer{plan.layers.length > 1 ? "s" : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3" />
                    {names.length} dishes
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onDeletePlan(plan.id)}
                className="flex h-[26px] w-[26px] items-center justify-center rounded-md text-[#9a9890] hover:bg-[#f5f2ed] hover:text-[#c17f5a]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={onNewPlan}
          className="inline-flex w-full items-center justify-center gap-1 rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-2 text-[13px] hover:bg-[#f5f2ed]"
        >
          <Plus className="h-3.5 w-3.5" />
          Plan a new bento
        </button>
      </div>
    </div>
  );
}
