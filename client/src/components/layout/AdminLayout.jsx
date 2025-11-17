/**
 * Admin Layout Component - Modern Sidebar Design
 * Professional admin panel with sidebar navigation using KMJ color palette
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Megaphone,
  FileText,
  MapPin,
  Package,
  AlertCircle,
  Award,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ADMIN_NAV, USER_NAV } from '../../lib/constants';
import useAuthStore from '../../store/authStore';
import Avatar from '../common/Avatar';
import logo from '../../assets/Images/logos.png';
import mosqueImage from '../../assets/Images/Mos.png';
import { getAllNotices } from '../../services/noticeService';

const AdminLayout = ({ children, className }) => {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  // Fetch latest notices for notifications
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoadingNotices(true);
        const response = await getAllNotices({ limit: 5, page: 1 }); // Get latest 5 notices
        setNotifications(response.data.notices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoadingNotices(false);
      }
    };

    fetchNotices();
  }, []);

  const navigation = isAdmin() ? ADMIN_NAV : USER_NAV;
  const unreadCount = notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length;

  const iconMap = {
    LayoutDashboard,
    Users,
    CreditCard,
    Receipt,
    Megaphone,
    FileText,
    MapPin,
    Package,
    AlertCircle,
    Award,
    User,
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Pattern with Mosque Image - Similar to Login Page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Mosque Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ 
            backgroundImage: `url(${mosqueImage})`,
            filter: 'blur(1px)'
          }}
        />
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="admin-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="#31757A" strokeWidth="1"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="#41A4A7" strokeWidth="1"/>
                <circle cx="50" cy="50" r="10" fill="none" stroke="#31757A" strokeWidth="1"/>
                <path d="M 50,20 L 50,80 M 20,50 L 80,50" stroke="#41A4A7" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-pattern)" />
          </svg>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-[#E3F9F9]/20 via-transparent to-[#31757A]/10" />
      </div>

      {/* Header - Full Width Like Public Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 z-40 shadow-sm"
      >
        <div className="h-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex items-center justify-between gap-4">
            {/* Left: Logo + Menu Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>

              {/* Logo and Title */}
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img
                  src={logo}
                  alt="KMJ Logo"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                {/* <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-[#1F2E2E]">Kalloor Muslim Jama-ath</h1>
                  <p className="text-xs text-[#31757A] font-medium">
                    {isAdmin() ? 'Admin Panel' : 'Member Portal'}
                  </p>
                </div> */}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <Menu as="div" className="relative">
                <Menu.Button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <BellIcon className="h-6 w-6 text-gray-600" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold shadow-lg"
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
                  <Menu.Items className="fixed sm:absolute right-4 left-4 sm:left-auto sm:right-0 mt-2 sm:w-80 origin-top rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none z-50">
                    <div className="p-3 sm:p-4 border-b border-gray-200 bg-linear-to-r from-[#E3F9F9] to-white">
                      <h3 className="text-sm font-bold text-[#1F2E2E]">
                        Latest Announcements
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {loadingNotices ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#31757A]"></div>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-3 sm:px-4 py-8 text-center">
                          <BellIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs sm:text-sm text-gray-500">No announcements</p>
                        </div>
                      ) : (
                        notifications.map((notice) => (
                          <Menu.Item key={notice._id}>
                            {({ active }) => (
                              <div
                                onClick={() => navigate('/admin/notices')}
                                className={cn(
                                  'px-3 sm:px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors',
                                  active && 'bg-gray-50',
                                  (notice.priority === 'urgent' || notice.priority === 'high') && 'bg-[#E3F9F9]/30'
                                )}
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  {/* Priority Icon */}
                                  <div className={`p-1.5 rounded-lg shrink-0 ${
                                    notice.priority === 'urgent' ? 'bg-red-100' :
                                    notice.priority === 'high' ? 'bg-orange-100' :
                                    notice.priority === 'normal' ? 'bg-blue-100' :
                                    'bg-gray-100'
                                  }`}>
                                    {notice.priority === 'urgent' ? (
                                      <ExclamationTriangleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                                    ) : (
                                      <BellIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                        notice.priority === 'high' ? 'text-orange-600' :
                                        notice.priority === 'normal' ? 'text-blue-600' :
                                        'text-gray-600'
                                      }`} />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    {/* Priority Badge */}
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase ${
                                        notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                        notice.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                        notice.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {notice.priority}
                                      </span>
                                    </div>
                                    
                                    {/* Title */}
                                    <p className="text-xs sm:text-sm text-[#1F2E2E] font-medium line-clamp-1">
                                      {notice.title}
                                    </p>
                                    
                                    {/* Content Preview */}
                                    <div 
                                      className="text-[11px] sm:text-xs text-gray-600 mt-1 line-clamp-2"
                                      dangerouslySetInnerHTML={{ __html: notice.content }}
                                    />
                                    
                                    {/* Time */}
                                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                      {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                        ))
                      )}
                    </div>
                    { isAdmin() && <div className="p-2 sm:p-3 text-center border-t border-gray-200">
                      <button 
                        onClick={() => navigate('/admin/notices')}
                        className="text-xs sm:text-sm text-[#31757A] hover:text-[#41A4A7] font-semibold transition-colors"
                      >
                        View all announcements
                      </button>
                    </div> }
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Settings */}
              {/* <button
                onClick={() => navigate('/settings')}
                className="hidden sm:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
              </button> */}

              {/* User Profile Dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <Avatar
                    name={user?.name || user?.username}
                    src={user?.avatar}
                    size="sm"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-[#1F2E2E] truncate max-w-[120px]">
                      {user?.name || user?.username}
                    </p>
                    <p className="text-xs text-[#31757A]">
                      {isAdmin() ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <ChevronRightIcon className="hidden lg:block h-4 w-4 text-gray-400" />
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
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-bold text-[#1F2E2E] truncate">
                        {user?.name || user?.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/admin/profile')}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              active ? 'bg-gray-100 text-[#1F2E2E]' : 'text-gray-700'
                            )}
                          >
                            <UserCircleIcon className="h-5 w-5" />
                            My Profile
                          </button>
                        )}
                      </Menu.Item>
                      
                      {/* <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/settings')}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              active ? 'bg-gray-100 text-[#1F2E2E]' : 'text-gray-700'
                            )}
                          >
                            <Cog6ToothIcon className="h-5 w-5" />
                            Settings
                          </button>
                        )}
                      </Menu.Item> */}
                    </div>

                    <div className="p-2 border-t border-gray-200">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              active ? 'bg-red-50 text-red-600' : 'text-red-600'
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
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: 0,
          width: sidebarCollapsed ? '80px' : '280px'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md border-r border-gray-200 z-30 hidden lg:block shadow-lg"
      >
        {/* Collapse Button */}
        <div className="absolute -right-4 top-4 z-10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-full bg-white border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] transition-all shadow-md"
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%)]">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                    sidebarCollapsed ? 'justify-center px-4 py-3' : 'px-4 py-3',
                    isActive
                      ? 'bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white shadow-lg shadow-[#31757A]/30'
                      : 'text-gray-700 hover:bg-[#E3F9F9] hover:text-[#1F2E2E]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-white" : "text-gray-600 group-hover:text-[#31757A]"
                    )} />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <motion.div
                        layoutId="activeSidebarTab"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section at Bottom */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-linear-to-t from-white to-transparent"
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              {!sidebarCollapsed && 'Logout'}
            </button>
          </motion.div>
        )}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-80 bg-white/98 backdrop-blur-lg z-50 lg:hidden shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="KMJ Logo"
                    className="h-12 w-full object-contain"
                  />
                  {/* <div className="hidden sm:block">
                    <h1 className="text-lg font-bold text-[#1F2E2E]">Kalloor Muslim Jama-ath</h1>
                    <p className="text-xs text-[#31757A] font-medium">
                      {isAdmin() ? 'Admin Panel' : 'Member Portal'}
                    </p>
                  </div> */}
                </div>
                  
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
                {navigation.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white shadow-lg shadow-[#31757A]/30'
                            : 'text-gray-700 hover:bg-[#E3F9F9] hover:text-[#1F2E2E]'
                        )
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-md text-sm font-semibold"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ 
          marginLeft: window.innerWidth >= 1024 ? (sidebarCollapsed ? '80px' : '280px') : '0',
          transition: 'margin-left 0.3s'
        }}
        className={cn(
          'pt-24 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen relative z-10',
          className
        )}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;
