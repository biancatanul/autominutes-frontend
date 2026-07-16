import "./ProfileCard.css";
import Button from "../../atoms/Button/Button";
import { useNavigate } from "react-router-dom";

type User = {
    name: string;
    email: string;
    avatarUrl: string;
};

type ProfileCardProps = {
    user: User | null;
};


function ProfileCard({ user }: ProfileCardProps) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/Login");
    }

    if (!user) {
        return (
            <Button 
                text="Login"
                onClick={handleLogin}
            />
        );
    }

    return (
        <div className="profile-card">
            <img src={user.avatarUrl} alt={user.name} />
            <span>{user.name}</span>
        </div>
    );
}

export default ProfileCard;