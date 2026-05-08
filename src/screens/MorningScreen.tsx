import { CalendarDays, ChevronRight, MoonStar, Sun, SunMedium, Users } from "lucide-react";
import type { Plan } from "../lib/types";

type Props = {
  today: string;
  plans: Plan[];
  fmtDate: (iso: string) => string;
  fmtDateLong: (iso: string) => string;
  collectDishNames: (plan: Plan) => string[];
  renderFolder: (plan: Plan, idx: number, autoExpand: boolean) => React.ReactNode;
  onNewPlan: () => void;
  onSwitchSaved: () => void;
  onOpenDay: (isoDate: string) => void;
};

export default function MorningScreen(props: Props) {
  const todayPlans = props.plans.filter((p) => p.isoDate === props.today);
  const upcomingByDate = props.plans
    .filter((p) => p.isoDate > props.today)
    .reduce<Record<string, Plan[]>>((acc, p) => {
      if (!acc[p.isoDate]) acc[p.isoDate] = [];
      acc[p.isoDate].push(p);
      return acc;
    }, {});

  return (
    <div className="flex-1 p-5">
      <div className="mb-4 flex items-center gap-3 rounded-[14px] bg-[linear-gradient(135deg,#e8f0ec_0%,#f0e8e0_100%)] px-[18px] py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#c17f5a]">
          <Sun className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-[#5d8474]">{props.fmtDateLong(props.today)}</div>
          <div className="mt-0.5 text-xs text-[#6b6a66]">
            {todayPlans.length ? "Here's what to pack today. You've got this." : "No bento on the menu today."}
          </div>
        </div>
      </div>

      {!!todayPlans.length && todayPlans.length > 1 && (
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-[#9a9890]">
          <Users className="h-3.5 w-3.5" />
          {todayPlans.length} bentos to pack · tap to expand
        </div>
      )}
      {!!todayPlans.length &&
        todayPlans.map((p, i) => <div key={p.id}>{props.renderFolder(p, i, todayPlans.length === 1)}</div>)}

      {!todayPlans.length && (
        <div className="mb-4 rounded-[14px] bg-[#e8f0ec] px-5 py-7 text-center">
          <div className="mb-2.5 text-[#7a9e8e]">
            <MoonStar className="mx-auto h-9 w-9" />
          </div>
          <div className="mb-1 text-sm font-medium">Nothing planned for today</div>
          <div className="mb-4 text-[13px] leading-[1.5] text-[#6b6a66]">No worries — plan one now or pull from a saved bento.</div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={props.onNewPlan}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#7a9e8e] bg-[#7a9e8e] px-3 py-1.5 text-xs text-white hover:border-[#5d8474] hover:bg-[#5d8474]"
            >
              <SunMedium className="h-3.5 w-3.5" />
              Plan today's bento
            </button>
            <button
              type="button"
              onClick={props.onSwitchSaved}
              className="inline-flex items-center gap-1 rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-1.5 text-xs hover:bg-[#f5f2ed]"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Browse saved
            </button>
          </div>
        </div>
      )}

      {Object.keys(upcomingByDate).length > 0 && (
        <>
          <div className="mb-2 mt-[18px] flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-[#9a9890]">
            <CalendarDays className="h-3.5 w-3.5" />
            Coming up
          </div>
          {Object.keys(upcomingByDate)
            .sort()
            .map((date) => {
              const plans = upcomingByDate[date];
              const dayDiff = Math.round((new Date(`${date}T00:00:00`).getTime() - new Date(`${props.today}T00:00:00`).getTime()) / 86400000);
              const whenText = dayDiff === 1 ? "Tomorrow" : `In ${dayDiff} days`;
              const labels = plans.map((p) => p.label || "Bento");
              const dishStr = plans.flatMap((p) => props.collectDishNames(p)).join(" · ");
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => props.onOpenDay(date)}
                  className="mb-2 flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-[#e0dcd4] bg-white px-4 py-3.5 text-left transition-all hover:border-[#7a9e8e] hover:bg-[#e8f0ec]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f0e8f5] text-[#9e7ab8]">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium">
                      {whenText} · {props.fmtDate(date)}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-[#6b6a66]">{dishStr}</div>
                    <div className="mt-1 flex gap-1">
                      {labels.map((l, i) => (
                        <span key={i} className="rounded-[10px] bg-[#f5f2ed] px-1.5 py-0.5 text-[10px] text-[#6b6a66]">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#9a9890]" />
                </button>
              );
            })}
        </>
      )}
    </div>
  );
}
