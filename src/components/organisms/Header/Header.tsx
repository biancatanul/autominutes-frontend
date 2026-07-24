import { useEffect, useState } from "react";
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";
import ProfileCard from "../../organisms/ProfileCard/ProfileCard";
import "./Header.css";

function Header() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }

        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <div className="header">
            <div className="header-right">
                <div className="header-actions">
                    <DarkModeToggle
                        isDark={isDark}
                        onToggle={() => setIsDark(!isDark)}
                    />
                </div>

                <ProfileCard />
            </div>
        </div>
    );
}

export default Header;