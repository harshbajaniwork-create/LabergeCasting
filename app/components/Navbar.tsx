import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";

interface NavbarProps {
  className?: string;
}

export default function Navbar({
  className = "",
}: NavbarProps): React.JSX.Element {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const navItems = [
    { id: "home", label: t("nav.home") },
    { id: "our-approach", label: t("nav.ourApproach") },
    { id: "real-stories", label: t("nav.realStories") },
    { id: "tell-your-story", label: t("nav.tellYourStory") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Show navbar after scrolling 100px
      setIsVisible(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${className}`}
    >
      {/* Translucent background with backdrop blur */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md border-b border-white/10" />

      {/* Navbar content */}
      <div className="relative px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="home"
            smooth={true}
            duration={800}
            className="cursor-pointer flex items-center space-x-3 group"
          >
            <img
              src="/logo/logo.png"
              alt="Laberge Casting"
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                smooth={true}
                duration={800}
                offset={-80}
                className="text-stone-700 font-sans font-light text-sm uppercase tracking-widest cursor-pointer relative group transition-colors duration-300 hover:text-stone-900"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-stone-800 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            
            {/* Language Toggle */}
            <LanguageToggle />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-stone-700 hover:text-stone-900 transition-colors duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
