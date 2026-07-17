import Searchbar from "../../organisms/Searchbar/Searchbar";
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";
import ProfileCard from "../../organisms/ProfileCard/ProfileCard";
import "./Header.css";
import { useState } from "react";
import { useEffect } from "react";

function Header() {
    const [search, setSearch] = useState("");

    const handleSearch = () => { 
        console.log("Searching for:", search);
    };

    return (
        <div className="header">
            <Searchbar
                value = {search}
                onChange = {setSearch}
                onSearch = {handleSearch}
                placeholder = "Search..."
            />
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