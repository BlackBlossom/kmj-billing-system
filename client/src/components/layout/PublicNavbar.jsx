/**
 * Public Navbar - Modern Glassmorphism Design
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/Images/logos.png';

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 h-18 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-340 mx-auto px-4 ">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={logo}
                  alt="Kalloor Masjid Jama-ath"
                  className="h-12 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative px-4 py-2 text-[#1F2E2E] hover:text-[#31757A] transition-colors duration-200 font-medium group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-[#31757A] to-[#41A4A7] group-hover:w-3/4 transition-all duration-200" />
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-2.5 rounded-lg text-[#31757A] font-semibold hover:bg-[#E3F9F9] transition-all duration-200"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-2.5 rounded-lg bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white font-semibold shadow-md hover:shadow-xl transition-all duration-200"
                >
                  Register
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#1F2E2E] hover:bg-[#E3F9F9] transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-[#1F2E2E] hover:text-[#31757A] transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3 border-t border-gray-100">
                  <Link to="/login" className="block">
                    <button className="w-full px-6 py-2.5 rounded-lg border-2 border-[#31757A] text-[#31757A] font-semibold hover:bg-[#E3F9F9] transition-all duration-200">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="block">
                    <button className="w-full px-6 py-2.5 rounded-lg bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-18" />
    </>
  );
};

export default PublicNavbar;
