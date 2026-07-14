import RecentMeetingCard from "../RecentMeetingCard/RecentMeetingCard";
import "./RecentMeetings.css";
import { FiClock } from "react-icons/fi";

type Meeting = {
    id: number;
    title: string;
    description: string;
    date: string;
};

type RecentMeetingsProps = {
    meetings: Meeting[];
};

function RecentMeetings({ meetings }: RecentMeetingsProps) {
    return (
        <div className="recent-meetings">
            {meetings.length === 0 ? (
                <div className="no-meetings">
                    <FiClock size={36} color="#876fc5" />
                    <h3>No recent meetings found.</h3>
                    <p>Your recent meetings will appear here.</p>
                </div>
            ) : (
                meetings.map((meeting) => (
                    <RecentMeetingCard
                        key={meeting.id}
                        title={meeting.title}
                        description={meeting.description}
                        date={meeting.date}
                    />
                ))
            )}
        </div>
    );
}

export default RecentMeetings;