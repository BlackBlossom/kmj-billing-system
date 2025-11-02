/**
 * Auth Layout Component
 * Aceternity-inspired minimal authentication layout - Light Theme
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const AuthLayout = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white via-neutral-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-5" />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-200 rounded-full blur-[120px]"
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
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200 rounded-full blur-[100px]"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn('w-full max-w-md relative z-10', className)}
      >
        {/* Glass Card */}
        <div className="relative group">
          {/* Card Border Gradient */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition duration-500"></div>
          
          {/* Card Content */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200 shadow-2xl">
            {/* Logo Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center mb-8"
            >
              {/* Logo */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative mb-4"
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-blue-600 rounded-xl blur-lg opacity-30"></div>
                <div className="relative w-16 h-16 bg-linear-to-br from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center text-3xl shadow-xl">
                  KMJ
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-neutral-900 mb-1 tracking-tight">
                Kalloor Muslim JamaAth
              </h1>
              {/* <p className="text-sm text-neutral-600">
                Kalloor Muslim JamaAth
              </p> */}
            </motion.div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-neutral-500 mt-6"
        >
          © {new Date().getFullYear()} Kalloor Muslim JamaAth
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
