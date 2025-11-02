/**
 * Header Component
 * Top navigation with user menu and notifications
 */

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { APP_INFO } from '../../lib/constants';
import useAuthStore from '../../store/authStore';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

const Header = ({ onMenuClick, className }) => {
  const { user, logout, isAdmin } = useAuthStore();
  const [notifications] = useState([
    { id: 1, message: 'New member registered', time: '5 min ago', unread: true },
    { id: 2, message: 'Bill payment received', time: '1 hour ago', unread: true },
    { id: 3, message: 'Monthly report generated', time: '2 hours ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white border-b border-neutral-200',
        'backdrop-blur-sm bg-white/95',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Button (Mobile) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Bars3Icon className="h-6 w-6 text-neutral-600" />
          </button>

          {/* Logo & Title */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-accent-500 text-white font-bold text-lg">
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
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <BellIcon className="h-6 w-6 text-neutral-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-600 text-xs text-white">
                  {unreadCount}
                </span>
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
              <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                            'px-4 py-3 cursor-pointer border-b border-neutral-100',
                            active && 'bg-neutral-50',
                            notification.unread && 'bg-primary-50/30'
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
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Avatar
                name={user?.name || user?.username}
                src={user?.avatar}
                size="sm"
              />
              <div className="hidden sm:block text-left">
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
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4 border-b border-neutral-200">
                  <p className="text-sm font-medium text-neutral-900">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{user?.email}</p>
                  <Badge variant="primary" size="sm" className="mt-2">
                    {isAdmin() ? 'Admin' : 'User'}
                  </Badge>
                </div>

                <div className="p-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm',
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
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm',
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
                          'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-error-600',
                          active && 'bg-error-50'
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
        </div>
      </div>
    </header>
  );
};

export default Header;
