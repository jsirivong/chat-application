import { LanguageFlag, type Language } from "../types/Language";
import type User from "../types/User";
import { Link } from 'react-router'

interface IProps {
    friend: User
}

export const getLanguageFlag = (language: Language) => {
    if (language) {
        const countryCode = LanguageFlag[language];

        if (countryCode) {
            return (
                <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={`${language} flag`} className="h-3 mr-1 inline-block" />
            )
        }
    }

    return null;
}

export default function FriendCard({ friend }: IProps) {
    return (
        <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12">
                        <img src={friend.profile_picture} alt={friend.first_name + " " + friend.last_name} />
                    </div>
                    <h3 className="font-semibold truncate">{friend.first_name + " " + friend.last_name}</h3>
                </div>

                {/* LANGUAGE AND BIO */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(friend.native_language)}
                        Native: {friend.native_language}
                    </span>
                </div>

                <Link to={`/chat/${friend.id}`} className="btn btn-outline w-full">
                    Message
                </Link>
            </div>
        </div>
    )
}