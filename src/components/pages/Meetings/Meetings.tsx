import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import MeetingTable from "@organisms/MeetingTable/MeetingTable";
import Button from "@atoms/Button/Button";
import NewMeetingModal from "@organisms/NewMeetingModal/NewMeetingModal";
import "./Meetings.css";
import { useState } from "react";

function Meetings() {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div className="meetings-page">
            <Sidebar />

            <main className="meetings-content">
                <Header />

                <div className="meetings-title-row">
                    <h1>Meeting archive</h1>
                    <Button text="+ New Meeting" onClick={() => setShowModal(true)} />
                </div>

                <MeetingTable />
            </main>
            
           {showModal && <NewMeetingModal onClose={() => setShowModal(false)} />}
        </div>
    );
}

export default Meetings;