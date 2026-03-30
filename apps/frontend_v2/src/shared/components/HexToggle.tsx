import Logo from "@icons/underworlds_logo.svg?react";
import Hex from "@icons/hexagon.svg?react";

interface HexToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

function HexToggle({ checked, onChange }: HexToggleProps) {

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
