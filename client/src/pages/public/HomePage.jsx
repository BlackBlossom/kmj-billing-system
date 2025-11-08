/**
 * Home Page - Modern Professional Design
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getAllNotices } from '../../services/noticeService';

// Import images
import banner1 from '../../assets/Images/banner-1.jpg';
import banner2 from '../../assets/Images/banner-2.jpg';
import banner4 from '../../assets/Images/banner-4.jpg';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const location = useLocation();

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  // Fetch notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoadingNotices(true);
        const response = await getAllNotices({ limit: 6, page: 1 }); // Get latest 6 notices
        setNotices(response.data.notices);
      } catch (error) {
        console.error('Error fetching notices:', error);
        // Silently fail - don't show error toast on home page
      } finally {
        setLoadingNotices(false);
      }
    };

    fetchNotices();
  }, []);

  // Carousel images
  const slides = [
    { id: 1, image: banner1, alt: 'Masjid View 1' },
    { id: 2, image: banner2, alt: 'Masjid View 2' },
    { id: 3, image: banner4, alt: 'Masjid View 3' },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Stats
  const stats = [
    { icon: UserGroupIcon, count: '1000+', label: 'Active Members' },
    { icon: DocumentTextIcon, count: '500+', label: 'Families Registered' },
    { icon: CheckCircleIcon, count: '50+', label: 'Community Events' },
    { icon: ClockIcon, count: '58+', label: 'Years of Service' },
  ];

  // Features
  const features = [
    {
      icon: UserGroupIcon,
      title: 'Member Management',
      description: 'Streamlined registration and membership tracking for families and individuals',
    },
    {
      icon: DocumentTextIcon,
      title: 'Bill Management',
      description: 'Transparent billing system with easy online payment and detailed history',
    },
    {
      icon: BellIcon,
      title: 'Announcements',
      description: 'Stay updated with community news, events, and important notifications',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section id="home" className="relative bg-linear-to-br from-[#31757A] via-[#31757A] to-[#1F2E2E] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#41A4A7] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-340 mx-auto px-6 sm:px-4 lg:px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4 sm:mb-6">
                <div className="w-2 h-2 bg-[#41A4A7] rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm text-white font-medium">
                  Serving the Community Since 1967
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Kalloor Muslim
                <span className="block text-[#E3F9F9] mt-2">Jama-ath</span>
              </h1>

              {/* Arabic Text */}
              <div className="mb-6 sm:mb-8 py-4 sm:py-6 border-y border-white/20">
                <p className="text-xl sm:text-2xl md:text-3xl text-white font-arabic mb-2">
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  In the name of Allah, the Most Gracious, the Most Merciful
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
                A digital platform connecting our community through faith and service.
                Manage your membership, track contributions, and stay informed about events.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-[#31757A] font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <UserGroupIcon className="w-5 h-5" />
                    <span className="whitespace-nowrap">Join Our Community</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-[#31757A] transition-all duration-300 text-center"
                  >
                    Member Login
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-[#31757A] transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-[#31757A] transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'bg-white w-6 sm:w-8'
                          : 'bg-white/50 w-1.5 sm:w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#31757A] to-[#41A4A7] mb-3 sm:mb-4 shadow-lg">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2E2E] mb-1">
                  {stat.count}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Our Services
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive digital solutions for our community
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                className="group"
              >
                <div className="h-full p-6 sm:p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F2E2E] mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  {/* <button className="text-sm sm:text-base text-[#31757A] font-semibold hover:text-[#41A4A7] transition-all flex items-center gap-2 group-hover:gap-3 duration-200">
                    Learn More
                    <ArrowRightIcon className="w-4 h-4" />
                  </button> */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section id="notices" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <BellIcon className="w-8 h-8 text-[#31757A]" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E]">
                Latest Announcements
              </h2>
            </div>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Stay updated with community news and important announcements
            </p>
          </motion.div>

          {/* Notices Grid */}
          {loadingNotices ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31757A]"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No announcements available at the moment</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                  className="group"
                >
                  <div className="h-full p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
                    {/* Priority Bar */}
                    <div className={`h-1 w-full rounded-full mb-4 ${
                      notice.priority === 'urgent' ? 'bg-linear-to-r from-red-500 to-rose-600' :
                      notice.priority === 'high' ? 'bg-linear-to-r from-orange-500 to-amber-600' :
                      notice.priority === 'normal' ? 'bg-linear-to-r from-blue-500 to-blue-600' :
                      'bg-linear-to-r from-gray-400 to-gray-500'
                    }`}></div>

                    {/* Priority Badge & Icon */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        notice.priority === 'urgent' ? 'bg-red-100' :
                        notice.priority === 'high' ? 'bg-orange-100' :
                        notice.priority === 'normal' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {notice.priority === 'urgent' ? (
                          <ExclamationTriangleIcon className={`w-5 h-5 ${
                            notice.priority === 'urgent' ? 'text-red-600' :
                            notice.priority === 'high' ? 'text-orange-600' :
                            'text-blue-600'
                          }`} />
                        ) : (
                          <BellIcon className={`w-5 h-5 ${
                            notice.priority === 'high' ? 'text-orange-600' :
                            notice.priority === 'normal' ? 'text-blue-600' :
                            'text-gray-600'
                          }`} />
                        )}
                      </div>

                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                        notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        notice.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        notice.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.priority}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#1F2E2E] mb-3 line-clamp-2 group-hover:text-[#31757A] transition-colors">
                      {notice.title}
                    </h3>

                    {/* Content */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {notice.content}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                        <span>{new Date(notice.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <EyeIcon className="w-4 h-4 text-purple-600" />
                        <span>{notice.views || 0} views</span>
                      </div>
                      {(notice.expiryDate || notice.expiresAt) && (
                        <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span>Expires: {new Date(notice.expiryDate || notice.expiresAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* View All Button */}
          {notices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              className="text-center mt-8 sm:mt-12"
            >
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base inline-flex items-center gap-2">
                View All Announcements
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-4 sm:mb-6">
                About Our Community
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] rounded-full mb-4 sm:mb-6" />
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                Kalloor Masjid Jama-ath has been serving the community for over five decades, 
                bringing together families through faith, unity, and service.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                Our digital platform makes it easier than ever to stay connected, manage your 
                membership, and participate in community activities.
              </p>
              <Link to="/register">
                <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                  Join Today
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="relative h-64 sm:h-80 lg:h-full mt-8 lg:mt-0"
            >
              <img
                src={banner2}
                alt="Masjid"
                className="rounded-2xl w-full h-full object-cover shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-linear-to-br from-[#31757A] to-[#1F2E2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join our community platform and stay connected with all activities, events, and updates
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <button className="px-10 py-4 rounded-xl bg-white text-[#31757A] font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Register Now
                </button>
              </Link>
              <Link to="/login">
                <button className="px-10 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-[#31757A] transition-all duration-300">
                  Member Login
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
