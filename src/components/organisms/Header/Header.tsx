import Searchbar from "../../organisms/Searchbar/Searchbar";
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";
import ProfileCard from "../../organisms/ProfileCard/ProfileCard";
import "./Header.css";
import { useState } from "react";
import { useEffect } from "react";

type User = {
    name: string;
    email: string;
    avatarUrl: string;
};


function Header() {
    const [search, setSearch] = useState("");

    const handleSearch = () => { 
        console.log("Searching for:", search);
    };

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        
        fetch("/api/auth/me")
            .then((res) => {
                if (!res.ok) {
                    setUser(null);
                    return;
                }

                return res.json();
            })
            .then((data) => {
                if (data) {
                    setUser(data);
                }
            });
    }, []);

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

                <ProfileCard user={user} />
            </div>
        </div>
    )
}

export default Header;