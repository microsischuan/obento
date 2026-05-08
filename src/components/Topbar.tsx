import { Bookmark, Edit3, Sun } from "lucide-react";
import type { TabKey } from "../lib/types";
import Logo from "./Logo";

type Props = {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const tabs: { key: TabKey; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { key: "planner", icon: Edit3, label: "Plan" },
  { key: "saved", icon: Bookmark, label: "Saved" },
  { key: "morning", icon: Sun, label: "Morning" },
];

export default function Topbar({ tab, onTabChange }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-[#e0dcd4] px-5 pb-3 pt-3.5">
      <Logo />
      <div className="flex gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onTabChange(t.key)}
              className={[
                "flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-[13px] transition-all",
                active
                  ? "border-[#7a9e8e] bg-[#7a9e8e] text-white"
                  : "border-transparent text-[#6b6a66] hover:border-[#e0dcd4] hover:bg-[#f5f2ed]",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
