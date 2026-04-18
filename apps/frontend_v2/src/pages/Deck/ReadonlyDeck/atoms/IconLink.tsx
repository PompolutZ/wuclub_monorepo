import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface IconLinkProps {
  active?: boolean;
  label: string;
  to: {
    pathname: string;
    state: Record<string, unknown>;
  };
  children?: ReactNode;
  className?: string;
}

function IconLink({ children, label, to, active, className }: IconLinkProps) {
  return (
    <Link
      className={`${
        active ? "bg-purple-500 text-white" : "text-purple-900"
      } group flex rounded-md items-center px-2 py-2 text-sm ${className}`}
      to={to.pathname}
      state={to.state as never}
    >
      {children}
      <span className={`${active ? "text-white" : "text-gray-900"}`}>
        {label}
      </span>
    </Link>
  );
}

export default IconLink;
