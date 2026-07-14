import { FiSearch } from "react-icons/fi";
import "./Searchbar.css";

type SearchbarProps = {
    value: string;
    onChange: (value: string) => void;
    onSearch?: () => void;
    placeholder?: string;
};

function Searchbar({
    value,
    onChange,
    onSearch,
    placeholder = "Search...",
}: SearchbarProps) {
    return (
        <div className = "searchbar">
            <input
                type = "text"
                value = {value}
                placeholder = {placeholder}
                onChange = {(e) => onChange(e.target.value)}
                onKeyDown = {(e) => {
                    if (e.key === "Enter" && onSearch) {
                        onSearch();
                    }
                }}
            />
            <button onClick={onSearch}>
                <FiSearch color="#000000" />
            </button>
        </div>
    );
}

export default Searchbar;