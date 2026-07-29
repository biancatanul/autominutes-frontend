import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import "./Home.css";
import RecentMeetings from "@organisms/RecentMeetings/RecentMeetings";
import Header from "@organisms/Header/Header";
import * as meetingsApi from "@/lib/meetings";
import type { Meeting } from "@/lib/meetings";
import Spinner from "@atoms/Spinner/Spinner";

const RECENT_MEETINGS_LIMIT = 5;

function Home() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    meetingsApi.getMeetings(1, 1000)
      .then((result) => {
        const sorted = [...result.data].sort(
          (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        setMeetings(sorted.slice(0, RECENT_MEETINGS_LIMIT));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load meetings."))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (id: string) => {
    navigate(`/meetings/${id}`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete meeting "${title}"? This can't be undone.`)) return;
    await meetingsApi.deleteMeeting(id);
    setMeetings((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="home">
      <Sidebar />

      <main className="home-content">
        <Header title="Home" />

        <h2>Recent meetings</h2>
        <br />

        {loading ? (
          <div className="loading-row">
            <Spinner size={18} />
            <span>Loading...</span>
          </div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <RecentMeetings meetings={meetings} onOpen={handleOpen} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

export default Home;