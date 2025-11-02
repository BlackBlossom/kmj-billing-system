/**
 * Sidebar Component
 * Collapsible sidebar navigation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  UserCircleIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { ADMIN_NAV, USER_NAV } from '../../lib/constants';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ isOpen, onClose, className }) => {
  const { isAdmin } = useAuthStore();

  const navigation = isAdmin() ? ADMIN_NAV : USER_NAV;

  const iconMap = {
    Dashboard: HomeIcon,
    Members: UsersIcon,
    Billing: DocumentTextIcon,
    Notices: BellIcon,
    Reports: ChartBarIcon,
    Settings: Cog6ToothIcon,
    Profile: UserCircleIcon,
    Family: UsersIcon,
    Bills: WalletIcon,
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72',
          'bg-linear-to-b from-neutral-900 via-neutral-800 to-neutral-900',
          'border-r border-neutral-700',
          'lg:translate-x-0 lg:static lg:z-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-700">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-accent-500 text-white font-bold text-lg">
              🕌
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">KMJ</h2>
              <p className="text-xs text-neutral-400">
                {isAdmin() ? 'Admin Panel' : 'Dashboard'}
              </p>
            </div>
          </motion.div>

          {/* Close Button (Mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item, index) => {
            const Icon = iconMap[item.label];
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg',
                      'text-sm font-medium transition-all duration-200',
                      'group relative overflow-hidden',
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 shadow-lg shadow-primary-500/10'
                        : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-transform duration-200',
                          'group-hover:scale-110'
                        )}
                      />

                      {/* Label */}
                      <span>{item.label}</span>

                      {/* Badge (if any) */}
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-error-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-700">
          <div className="px-4 py-3 rounded-lg bg-neutral-800/50">
            <p className="text-xs text-neutral-400">Version</p>
            <p className="text-sm font-medium text-white">2.0.0</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
