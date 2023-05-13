import React from "react";
import useAuthUser from "../../../../hooks/useAuthUser";
import { PeopleIcon, PersonIcon } from "../../../../v2/components/Icons";

const DeckPrivacyToggleButton = ({ onClick, isPrivate, className = `text-purple-700 w-32 justify-center group hover:bg-gray-200 flex rounded-md items-center px-2 py-2 text-sm` }): JSX.Element | null => {
    const user = useAuthUser();

    if (!user) return null;

    return (
        <button
                className={className}
                onClick={onClick}
            >
                {isPrivate ? (
                    <>
                        <PeopleIcon className="h-5 w-5 mr-2" />
                        <span className="text-gray-900">Make public</span>
                    </>
                ) : (
                    <>
                        <PersonIcon className="h-5 w-5 mr-2" />
                        <span className="text-gray-900">Make private</span>
                    </>
                )}
            </button>
    )
}

export { DeckPrivacyToggleButton };