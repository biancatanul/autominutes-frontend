import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import MeetingTable from "@organisms/MeetingTable/MeetingTable";
import "./Meetings.css";

function Meetings() {
    return (
        <div className="meetings-page">
            <Sidebar />

            <main className="meetings-content">
                <Header />

                <h1>Meeting archive</h1>

                <MeetingTable />
            </main>
        </div>
    );
}

export default Meetings;