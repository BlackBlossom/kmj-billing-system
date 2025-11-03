/**
 * Auth Layout Component
 * Fuller immersive design with mosque background
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import mosqueImage from '../../assets/Images/Mos.png';
import logo from '../../assets/Images/logos.png';

const AuthLayout = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm hover:bg-white text-[#31757A] hover:text-[#41A4A7] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group border border-[#E3F9F9]"
        >
          <HomeIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </motion.div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={mosqueImage} 
          alt="Mosque Background" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-[#1F2E2E]/95 via-[#31757A]/90 to-[#41A4A7]/85"></div>
      </div>

      {/* Animated Wave Patterns */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-30%] left-[40%] w-[600px] h-[600px] rounded-[40%_45%_35%_40%] bg-[#41A4A7]/15 -z-10"
      />
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-25%] left-[35%] w-[600px] h-[600px] rounded-[40%_45%_35%_40%] bg-[#E3F9F9]/20 -z-10"
      />

      {/* Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 right-10 w-64 h-64 bg-[#E3F9F9]/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-[#41A4A7]/15 rounded-full blur-3xl"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn('w-full max-w-md relative z-10', className)}
      >
        {/* Glass Card */}
        <div className="relative group">
          {/* Enhanced Card Glow Effect */}
          <div className="absolute -inset-1.5 bg-linear-to-r from-[#41A4A7] via-[#31757A] to-[#E3F9F9] rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
          
          {/* Card Content */}
          <div className="relative bg-white/98 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-[#E3F9F9]/50">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] rounded-3xl pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2331757A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            {/* Logo Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center mb-6 relative"
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.0, rotate: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="relative flex justify-center items-center group/logo"
              >
                {/* <div className="absolute inset-0 bg-linear-to-br from-[#31757A] to-[#41A4A7] rounded-full blur-2xl opacity-50 group-hover/logo:opacity-70 transition-opacity"></div>
                <div className="absolute inset-0 bg-linear-to-br from-[#41A4A7] to-[#31757A] rounded-full blur-xl opacity-30 animate-pulse"></div> */}
                <img
                  src={logo}
                  alt="KMJ Logo"
                  className="relative w-2/3 h-auto object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Title */}
              {/* <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-linear-to-r from-[#1F2E2E] to-[#31757A] bg-clip-text text-transparent mb-1 tracking-tight text-center"
              >
                Kalloor Muslim Jama-Ath
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 font-medium"
              >
                Billing & Management System
              </motion.p> */}
            </motion.div>

            {/* Enhanced Decorative Line */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-1.5 bg-linear-to-r from-[#31757A] via-[#41A4A7] to-[#31757A] rounded-full mx-auto mb-8 shadow-lg"
            ></motion.div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 space-y-2"
        >
          <p className="text-xs text-white/95 drop-shadow-lg font-medium">
            © {new Date().getFullYear()} Kalloor Muslim Jama-Ath. All rights reserved.
          </p>
          <p className="text-xs text-white/70 drop-shadow-md">
            Empowering our community through digital innovation
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
