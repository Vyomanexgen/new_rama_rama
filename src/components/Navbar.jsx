import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobeAltIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Why Us", path: "/whyus" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-[#0b2b7a] text-white fixed top-0 left-0 w-full shadow-lg z-50 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/companylogo.png"
            alt="Logo"
            className="h-10 w-10 md:h-12 md:w-12"
          />
          <h1 className="text-lg md:text-xl font-bold tracking-wide">
            Security Services
          </h1>
        </Link>
        {/* <div className="flex items-center space-x-2">
          <img src="/src/assets/logo.jpg" alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
          <h1 className="text-lg md:text-xl font-bold tracking-wide">Security Services</h1>
        </div> */}

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-sm md:text-base font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`transition-colors duration-200 hover:text-yellow-400 ${location.pathname === link.path ? "text-yellow-400" : ""
                  }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* <button className="flex items-center bg-white text-[#0b2b7a] px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm md:text-base transition duration-200">
            <GlobeAltIcon className="w-4 h-4 md:w-5 md:h-5 mr-1" /> English
          </button>
          <button className="bg-yellow-400 text-[#0b2b7a] font-semibold px-4 py-1.5 rounded-md hover:bg-yellow-500 text-sm md:text-base transition duration-200">
            Sign In
          </button>*/}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-[#173ca2] transition duration-200"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0b2b7a] border-t border-blue-800 shadow-inner transition-all duration-300">
          <ul className="flex flex-col items-start px-6 py-4 space-y-3 text-sm md:text-base">
            {navLinks.map((link) => (
              <li key={link.name} className="w-full">
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block w-full py-2 transition-colors duration-200 ${location.pathname === link.path
                    ? "text-yellow-400"
                    : "text-white hover:text-yellow-400"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <button className="flex items-center bg-white text-[#0b2b7a] px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm md:text-base mt-2 transition duration-200">
                <GlobeAltIcon className="w-4 h-4 md:w-5 md:h-5 mr-1" /> English
              </button>
            </li>
            <li>
              <button className="bg-yellow-400 text-[#0b2b7a] font-semibold px-4 py-1.5 rounded-md hover:bg-yellow-500 text-sm md:text-base mt-2 transition duration-200">
                Sign In
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
