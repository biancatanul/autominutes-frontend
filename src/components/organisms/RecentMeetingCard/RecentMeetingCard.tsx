import "./RecentMeetingCard.css";
import { formatDate } from "@/lib/formatDate";

type RecentMeetingCardProps = {
  title: string;
  description: string;
  date: string;
  onOpen: () => void;
  onDelete: () => void;
};

function RecentMeetingCard({
  title,
  description,
  date,
  onOpen,
  onDelete,
}: RecentMeetingCardProps) {
  return (
    <div className="recent-card">
      <h3>{title}</h3>

      <p>{description}</p>

      <span>{formatDate(date)}</span>

      <div className="recent-card-buttons">
        <button onClick={onOpen}>Open</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default RecentMeetingCard;