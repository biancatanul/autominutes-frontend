import type { ReactNode } from "react";
import "./StatCard.css";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number | string;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
}

export default StatCard;