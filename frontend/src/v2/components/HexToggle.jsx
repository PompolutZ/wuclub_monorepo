import React from 'react'
import { ReactComponent as Logo } from "@icons/underworlds_logo.svg";
import { ReactComponent as Hex } from "../../svgs/hexagon.svg";

function HexToggle({ checked, onChange }) {

    return (
        <div className="flex w-6 h-6 relative cursor-pointer" onClick={() => onChange(!checked)}>
            <Hex className="text-gray-900 stroke-current stroke-2 w-6 h-6" />
            {checked && (
                <div className="absolute grid place-content-center inset-0">
                    <Logo className="w-4 h-4" />
                </div>
            )}
        </div>
    );
}

export default HexToggle
