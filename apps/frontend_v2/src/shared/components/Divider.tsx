import Logo from "@icons/underworlds_logo.svg?react";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={`w-full flex items-center space-x-2 ${className}`}>
      <hr className="flex-1 border-gray-400" />
      <Logo className="fill-current text-gray-400 text-2xl" />
      <hr className="flex-1 border-gray-400" />
    </div>
  );
}
