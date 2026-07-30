import RecentMeetingCard from "../RecentMeetingCard/RecentMeetingCard";
import "./RecentMeetings.css";
import { FiClock } from "react-icons/fi";
import type { Meeting } from "@/lib/meetings";

type RecentMeetingsProps = {
    meetings: Meeting[];
    onOpen: (id: string) => void;
    onDelete: (id: string, title: string) => void;
};

function RecentMeetings({ meetings, onOpen, onDelete }: RecentMeetingsProps) {
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
                        key={meeting._id}
                        title={meeting.title}
                        date={meeting.datetime}
                        onOpen={() => onOpen(meeting._id)}
                        onDelete={() => onDelete(meeting._id, meeting.title)}
                    />
                ))
            )}
        </div>
    );
}

export default RecentMeetings;