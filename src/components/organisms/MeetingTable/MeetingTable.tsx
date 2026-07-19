import "./MeetingTable.css";
import { FiFileText, FiMoreHorizontal } from "react-icons/fi";

type Meeting = {
    id: string;
    title: string;
    date: string;
    attendees: number;
    status: "Completed" | "Processing";
};

const meetings: Meeting[] = [];

function MeetingTable() {
    return (
        <div className="meeting-table">

            <div className="table-header">
                <div><FiFileText /> Title</div>
                <div><FiFileText /> Date and Time</div>
                <div><FiFileText /> Attendees</div>
                <div><FiFileText /> Status</div>
                <div><FiFileText /> Actions</div>
            </div>

            <div className="table-body">

                {meetings.length === 0 ? (
                    <div className="empty-table">
                        No meetings found.
                    </div>
                ) : (
                    meetings.map(meeting => (
                        <div
                            key={meeting.id}
                            className="table-row"
                        >
                            <div>{meeting.title}</div>
                            <div>{meeting.date}</div>
                            <div>{meeting.attendees}</div>
                            <div>{meeting.status}</div>

                            <div>
                                <button className="action-btn">
                                    <FiMoreHorizontal />
                                </button>
                            </div>
                        </div>
                    ))
                )}

            </div>

            <div className="pagination">
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>67</button>
                <button>68</button>
            </div>

        </div>
    );
}

export default MeetingTable;