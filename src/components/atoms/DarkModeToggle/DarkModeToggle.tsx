import { FiMoon, FiSun } from "react-icons/fi";
import "./DarkModeToggle.css";

type props = {
    isDark: boolean;
    onToggle: () => void;
};

function DarkModeToggle({ isDark, onToggle }: props) {
    return (
        <button className="dark-mode-toggle" onClick={onToggle}>
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
    );
}

export default DarkModeToggle;