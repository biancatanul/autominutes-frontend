import "./RecentMeetingCard.css";
import { formatDateTime } from "@/lib/formatDate";
import Button from "@atoms/Button/Button";

type RecentMeetingCardProps = {
  title: string;
  date: string;
  onOpen: () => void;
  onDelete: () => void;
};

function RecentMeetingCard({
  title,
  date,
  onOpen,
  onDelete,
}: RecentMeetingCardProps) {
  return (
    <div className="recent-card">
      <h3>{title}</h3>

      <p className="recent-card-date">{formatDateTime(date)}</p>

      <div className="recent-card-buttons">
        <Button text="Open" onClick={onOpen} />
        <Button text="Delete" onClick={onDelete} />
      </div>
    </div>
  );
}

export default RecentMeetingCard;