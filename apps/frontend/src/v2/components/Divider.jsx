import React from "react";
import { ReactComponent as Logo } from "@icons/underworlds_logo.svg";

function Divider({ className }) {
    return (
        <div
            className={`w-full flex items-center space-x-2 ${className}`}
        >
            <hr className="flex-1 border-gray-400" />
            <Logo className="fill-current text-gray-400 text-2xl" />
            <hr className="flex-1 border-gray-400" />
        </div>
    );
}

export default Divider;
