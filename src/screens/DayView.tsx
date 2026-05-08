import { ArrowLeft, CalendarDays, Sun } from "lucide-react";
import type { Plan } from "../lib/types";

type Props = {
  isoDate: string;
  today: string;
  plans: Plan[];
  fmtDateLong: (iso: string) => string;
  renderFolder: (plan: Plan, idx: number, autoExpand: boolean) => React.ReactNode;
  onBack: () => void;
};

export default function DayView({ isoDate, today, plans, fmtDateLong, renderFolder, onBack }: Props) {
  const isToday = isoDate === today;
  return (
    <div className="flex-1 p-5">
      <div
        className={[
          "mb-4 flex items-center gap-3 rounded-[14px] px-[18px] py-4",
          isToday ? "bg-[linear-gradient(135deg,#e8f0ec_0%,#f0e8e0_100%)]" : "bg-[linear-gradient(135deg,#f0e8f5_0%,#f0e8e8_100%)]",
        ].join(" ")}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white ${isToday ? "text-[#c17f5a]" : "text-[#9e7ab8]"}`}>
          {isToday ? <Sun className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-medium ${isToday ? "text-[#5d8474]" : "text-[#9e7ab8]"}`}>{fmtDateLong(isoDate)}</div>
          <div className="mt-0.5 text-xs text-[#6b6a66]">
            {plans.length} bento{plans.length > 1 ? "s" : ""} planned · tap to expand
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[#6b6a66] hover:bg-[rgba(255,255,255,0.5)] hover:text-[#2a2a28]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Today
        </button>
      </div>
      {plans.length ? (
        plans.map((p, i) => <div key={p.id}>{renderFolder(p, i, plans.length === 1)}</div>)
      ) : (
        <div className="rounded-[14px] bg-[#e8f0ec] px-5 py-7 text-center">
          <div className="mb-1 text-sm font-medium">No bentos for this day</div>
        </div>
      )}
    </div>
  );
}
