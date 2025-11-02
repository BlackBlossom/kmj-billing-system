/**
 * Dashboard Layout Component - Modern Floating Navbar Design
 * Inspired by Aceternity with Islamic color theme
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  WalletIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { ADMIN_NAV, USER_NAV, APP_INFO } from '../../lib/constants';
import useAuthStore from '../../store/authStore';
import Avatar from '../common/Avatar';

const DashboardLayout = ({ children, className }) => {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New member registered', time: '5 min ago', unread: true },
    { id: 2, message: 'Bill payment received', time: '1 hour ago', unread: true },
    { id: 3, message: 'Monthly report generated', time: '2 hours ago', unread: false },
  ]);

  const navigation = isAdmin() ? ADMIN_NAV : USER_NAV;
  const unreadCount = notifications.filter(n => n.unread).length;

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-neutral-50 to-emerald-50/30 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.12, 0.08],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-200 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.06, 0.1, 0.06],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-200 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div className="relative group">
          {/* Gradient Border */}
          <div className="absolute -inset-px bg-linear-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm" />
          
          {/* Navbar Content */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-emerald-600 to-blue-600 text-white font-bold text-xl shadow-lg">
                  🕌
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-neutral-900">
                    {APP_INFO.name}
                  </h1>
                  <p className="text-xs text-neutral-500">
                    {isAdmin() ? 'Admin Panel' : 'User Dashboard'}
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-2">
                {navigation.slice(0, 5).map((item) => {
                  const Icon = iconMap[item.label];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className="h-5 w-5" />
                          <span className="hidden xl:inline">{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeNavTab"
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-emerald-600 rounded-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Menu as="div" className="relative">
                  <Menu.Button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                    <BellIcon className="h-6 w-6 text-neutral-600" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-neutral-200 focus:outline-none">
                      <div className="p-4 border-b border-neutral-200">
                        <h3 className="text-sm font-semibold text-neutral-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                              <div
                                className={cn(
                                  'px-4 py-3 cursor-pointer border-b border-neutral-100 transition-colors',
                                  active && 'bg-neutral-50',
                                  notification.unread && 'bg-emerald-50/50'
                                )}
                              >
                                <p className="text-sm text-neutral-900">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-neutral-200">
                        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                    <Avatar
                      name={user?.name || user?.username}
                      src={user?.avatar}
                      size="sm"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.name || user?.username}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {isAdmin() ? 'Administrator' : 'Member'}
                      </p>
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-neutral-200 focus:outline-none">
                      <div className="p-4 border-b border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900">
                          {user?.name || user?.username}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
                          {isAdmin() ? 'Admin' : 'User'}
                        </div>
                      </div>

                      <div className="p-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => navigate('/profile')}
                              className={cn(
                                'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                                active && 'bg-neutral-100'
                              )}
                            >
                              <UserCircleIcon className="h-5 w-5 text-neutral-600" />
                              Profile
                            </button>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => navigate('/settings')}
                              className={cn(
                                'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                                active && 'bg-neutral-100'
                              )}
                            >
                              <Cog6ToothIcon className="h-5 w-5 text-neutral-600" />
                              Settings
                            </button>
                          )}
                        </Menu.Item>
                      </div>

                      <div className="p-2 border-t border-neutral-200">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 transition-colors',
                                active && 'bg-red-50'
                              )}
                            >
                              <ArrowRightOnRectangleIcon className="h-5 w-5" />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6 text-neutral-600" />
                  ) : (
                    <Bars3Icon className="h-6 w-6 text-neutral-600" />
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
                  transition={{ duration: 0.2 }}
                  className="lg:hidden border-t border-neutral-200 overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-1">
                    {navigation.map((item) => {
                      const Icon = iconMap[item.label];
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                              isActive
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                            )
                          }
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn('relative z-10 pt-28 pb-8 px-4 sm:px-6 lg:px-8', className)}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
