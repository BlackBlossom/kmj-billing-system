/**
 * Public Layout - Shared layout for all public pages
 */

import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navigation */}
      <PublicNavbar />

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1F2E2E] text-white py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 max-w-full">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 wrap-break-words">Kalloor Masjid Jama-ath</h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4 wrap-break-words">
                Building a stronger community through faith, unity, and digital innovation.
              </p>
            </div>
            <div className="max-w-full">
              <h4 className="font-semibold mb-4 text-[#41A4A7] text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-sm sm:text-base text-white/70 hover:text-[#41A4A7] transition-colors">Home</Link>
                <Link to="/about" className="block text-sm sm:text-base text-white/70 hover:text-[#41A4A7] transition-colors">About</Link>
                <Link to="/services" className="block text-sm sm:text-base text-white/70 hover:text-[#41A4A7] transition-colors">Services</Link>
                <Link to="/events" className="block text-sm sm:text-base text-white/70 hover:text-[#41A4A7] transition-colors">Events</Link>
                <Link to="/contact" className="block text-sm sm:text-base text-white/70 hover:text-[#41A4A7] transition-colors">Contact</Link>
                <Link to="/login" className="block text-sm sm:text-base text-white/70 hover:text-[#41A4A7] transition-colors">Login</Link>
              </div>
            </div>
            <div className="max-w-full min-w-0">
              <h4 className="font-semibold mb-4 text-[#41A4A7] text-sm sm:text-base">Contact</h4>
              <div className="space-y-3 text-white/70 text-sm sm:text-base">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0" />
                  <span className="wrap-break-words">Kalloor, Kerala, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="break-all">+91 703 482 9292</span>
                </div>
                <div className="flex items-start gap-2 min-w-0">
                  <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm break-all">kmjsecretary@kmjinfo.com</span>
                    <span className="text-xs sm:text-sm break-all">kalloormuslimjamath@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-white/50">
            <p className="text-xs sm:text-sm wrap-break-words">&copy; 2025 Kalloor Masjid Jama-ath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
