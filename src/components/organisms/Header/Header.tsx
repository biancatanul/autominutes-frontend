
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";
import ProfileCard from "../../organisms/ProfileCard/ProfileCard";
import "./Header.css";

function Header() {

    return (
        <div className="header">
            <div className="header-right">
                <div className="header-actions">
                    <DarkModeToggle
                        isDark = {false}
                        onToggle = {() => console.log("Toggling dark mode")}
                    />
                </div>

                <ProfileCard />
            </div>
        </div>
    )
}

export default Header;