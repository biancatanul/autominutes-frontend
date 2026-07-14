import { useState } from "react";   
import "./MeetingForm.css"

export default function MeetingForm() {

    const [url, setUrl] = useState("");
    const [name, setName] = useState("");

    return (
        <div className="meeting-form">

            <div className="url-row">

                <input
                    placeholder="Paste meeting URL"
                    value={url}
                    onChange={(e)=>setUrl(e.target.value)}
                />

                <button className="capturing">Start Capturing</button>

            </div>

            <input
                placeholder="Meeting Name (optional)"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />

        </div>
    );
}