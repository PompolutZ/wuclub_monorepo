// src/components/Navigation.tsx
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
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
  const routerState = useRouterState();
  const isHomePage = routerState.location.pathname === '/';
  console.log(routerState.location.pathname);

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
          <Link 
            to="/decks/create"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2"
          >
            + New Deck
          </Link>
         
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
            <MobileNavLink closeMenu={() => setIsMobileMenuOpen(false)} to="/">Home</MobileNavLink>
            <MobileNavLink closeMenu={() => setIsMobileMenuOpen(false)} to="/decks">Public Decks</MobileNavLink>
            <MobileNavLink closeMenu={() => setIsMobileMenuOpen(false)} to="/decks/create">Create Deck</MobileNavLink>
            <MobileNavLink closeMenu={() => setIsMobileMenuOpen(false)} to="/library">Library</MobileNavLink>
            <MobileNavLink closeMenu={() => setIsMobileMenuOpen(false)} to="/boards">Boards</MobileNavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

const MobileNavLink = ({ to, children, closeMenu }: { to: string; children: React.ReactNode, closeMenu: () => void }) => (
  <Link 
    to={to} 
    className="[&.active]:font-bold"
    onClick={() => closeMenu()}
  >
    {children}
  </Link>
);
