import type { ReactNode } from "react";
import StatCard from "@molecules/StatCard/StatCard";
import "./StatsRow.css";

export type Stat = {
  id: string;
  icon: ReactNode;
  label: string;
  value: number | string;
};

type StatsRowProps = {
  stats: Stat[];
};

function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="stats-row">
      {stats.map((stat) => (
        <StatCard key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}

export default StatsRow;