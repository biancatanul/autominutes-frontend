import { FiUser, FiSmile, FiStar, FiHeart, FiZap } from "react-icons/fi";
import type { ReactNode } from "react";

export interface ProfileIcon {
    id: string;
    icon: ReactNode;
}

export const PROFILE_ICONS: ProfileIcon[] = [
    { id: "user", icon: <FiUser /> },
    { id: "smile", icon: <FiSmile /> },
    { id: "star", icon: <FiStar /> },
    { id: "heart", icon: <FiHeart /> },
    { id: "zap", icon: <FiZap /> },
];

export function getProfileIcon(iconId: string | undefined): ReactNode | null {
    return PROFILE_ICONS.find((item) => item.id === iconId)?.icon ?? null;
}