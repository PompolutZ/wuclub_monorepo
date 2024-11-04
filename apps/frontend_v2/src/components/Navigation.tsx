// src/components/Navigation.tsx
import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface AnimatedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const AnimatedLink = ({ to, children, className = "" }: AnimatedLinkProps) => {
  return (
    <div className="relative group">
      <Link
        to={to}
        className={`${className} [&.active]:font-bold`}
      >
        {children}
      </Link>
      <div 
        className="absolute h-[2px] bg-gray-100 bottom-0 w-0 group-hover:w-1/3 transition-all duration-175"
      />
    </div>
  );
};

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isHomePage = router.state.location.pathname === '/';

  return (
    <header className={`p-2 relative z-10 ${isMobileMenuOpen ? 'bg-white' : ''}`}>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <AnimatedLink 
          to="/" 
          className={isHomePage ? 'text-gray-100' : 'text-gray-900'}
        >
          Home
        </AnimatedLink>
        <AnimatedLink 
          to="/decks"
          className={isHomePage ? 'text-gray-100' : 'text-gray-900'}
        >
          Public Decks
        </AnimatedLink>
        <AnimatedLink 
          to="/library"
          className={isHomePage ? 'text-gray-100' : 'text-gray-900'}
        >
          Library
        </AnimatedLink>
        <AnimatedLink 
          to="/boards"
          className={isHomePage ? 'text-gray-100' : 'text-gray-900'}
        >
          Boards
        </AnimatedLink>
        
        <div className="ml-auto flex items-center gap-4">
          {/* Temporarily commented out New Deck button until route is implemented
          <Link 
            to="/deck/create"
            className="bg-purple-600 hover:bg-purple-700 text-gray-100 px-4 py-2 rounded-md transition-colors"
          >
            + New Deck
          </Link>
          */}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 ${isMobileMenuOpen ? 'text-gray-900' : isHomePage ? 'text-gray-100' : 'text-gray-900'}`}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div 
          className={`
            fixed inset-x-0 top-[54px] bg-white shadow-lg
            flex flex-col gap-4 transition-all duration-300 transform
            ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}
          `}
        >
          <div className="p-4 flex flex-col gap-4">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
            <Link to="/decks" className="[&.active]:font-bold">
              Public Decks
            </Link>
            <Link to="/library" className="[&.active]:font-bold">
              Library
            </Link>
            <Link to="/boards" className="[&.active]:font-bold">
              Boards
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}