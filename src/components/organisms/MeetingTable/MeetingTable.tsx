import { useMeetings } from "@/context/MeetingsContext";
import "./MeetingTable.css";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/lib/formatDate";

function formatDate(iso: string){
    return formatDateTime(iso);
}

function MeetingTable() {

    const { meetings, loading, error, removeMeeting, page, totalPages, setPage } = useMeetings();
    const navigate = useNavigate();

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete meeting "${title}"? This can't be undone.`)) return;
        await removeMeeting(id);
    };

    return (
        <div className="meeting-table">

            <div className="table-header">
                <div><FiFileText /> Title</div>
                <div><FiFileText /> Date and Time</div>
                <div><FiFileText /> Status</div>
                <div><FiFileText /> Actions</div>
            </div>

            <div className="table-body">

                {loading ? (
                    <div className="empty-table">Loading meetings...</div>
                ) : error ? (
                    <div className="empty-table">{error}</div>
                ) : meetings.length === 0 ? (
                    <div className="empty-table">No meetings found.</div>
                ) : (
                    meetings.map(meeting => (
                        <div
                            key={meeting._id}
                            className="table-row"
                        onClick={() => navigate(`/meetings/${meeting._id}`)}
                        >
                            <div>{meeting.title}</div>
                            <div>{formatDate(meeting.datetime)}</div>
                            <div>
                                <span className={`status-badge status-${meeting.processingStatus}`}>
                                {meeting.processingStatus}
                                </span>
                            </div>

                            <div>
                                 <button
                                    className="action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(meeting._id, meeting.title);
                                    }}
                                    >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}

            </div>

            <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        className={p === page ? "active" : ""}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </button>
                ))}

                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default MeetingTable;