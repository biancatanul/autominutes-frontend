import "./RecentMeetingCard.css";

type RecentMeetingCardProps = {
  title: string;
  description: string;
  date: string;
};

function RecentMeetingCard({
  title,
  description,
  date,
}: RecentMeetingCardProps) {
  return (
    <div className="recent-card">
      <h3>{title}</h3>

      <p>{description}</p>

      <span>{date}</span>

      <div className="recent-card-buttons">
        <button>Open</button>
        <button>Delete</button>
      </div>
    </div>
  );
}

export default RecentMeetingCard;