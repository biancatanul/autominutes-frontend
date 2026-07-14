import Searchbar from "../../organisms/Searchbar/Searchbar";
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";
import "./Header.css";
import { useState } from "react";


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

            <div className="header-actions">
                <DarkModeToggle
                    isDark = {false}
                    onToggle = {() => console.log("Toggling dark mode")}
                />
            </div>
        </div>
    )
}

export default Header;