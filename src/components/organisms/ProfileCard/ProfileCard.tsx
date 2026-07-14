import "./ProfileCard.css";
import Button from "../../atoms/Button/Button";

type User = {
    name: string;
    email: string;
    avatarUrl: string;
};

type ProfileCardProps = {
    user: User | null;
};


function ProfileCard({ user }: ProfileCardProps) {
    if (!user) {
        return (
            <Button 
                text="Login"
                // onClick={handleLogin}
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