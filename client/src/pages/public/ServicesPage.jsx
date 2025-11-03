/**
 * Services Page - KMJ Services & Features
 */

import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PhoneIcon,
  HomeIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  // Main Services
  const services = [
    {
      icon: UserGroupIcon,
      title: 'Member Registration',
      description: 'Easy online registration for families and individuals to join our community',
      features: [
        'Simple registration process',
        'Family membership options',
        'Digital member ID cards',
        'Profile management',
      ],
    },
    {
      icon: DocumentTextIcon,
      title: 'Bill Management',
      description: 'Transparent billing system for community contributions and dues',
      features: [
        'Monthly bill generation',
        'Payment history tracking',
        'Multiple payment methods',
        'Automated reminders',
      ],
    },
    {
      icon: BellIcon,
      title: 'Announcements & Notices',
      description: 'Stay informed with real-time community updates and notifications',
      features: [
        'Event announcements',
        'Prayer time notifications',
        'Emergency alerts',
        'Community news',
      ],
    },
    {
      icon: CalendarDaysIcon,
      title: 'Event Management',
      description: 'Organized scheduling and coordination of community events',
      features: [
        'Event calendar',
        'RSVP system',
        'Event reminders',
        'Photo gallery',
      ],
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Document Management',
      description: 'Secure storage and access to important community documents',
      features: [
        'Meeting minutes',
        'Financial reports',
        'Policy documents',
        'Member certificates',
      ],
    },
    {
      icon: AcademicCapIcon,
      title: 'Islamic Education',
      description: 'Educational programs and resources for all age groups',
      features: [
        'Quran classes',
        'Islamic studies',
        'Youth programs',
        'Adult education',
      ],
    },
  ];

  // Additional Services
  const additionalServices = [
    {
      icon: HomeIcon,
      title: 'Masjid Facilities',
      description: 'Well-maintained prayer halls and community spaces',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Zakat Distribution',
      description: 'Fair and transparent distribution of Zakat funds',
    },
    {
      icon: PhoneIcon,
      title: '24/7 Support',
      description: 'Always available for community members in need',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#31757A] to-[#1F2E2E] py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#41A4A7] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              KMJ Services
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Comprehensive digital solutions designed to serve and connect our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Our Core Services
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to stay connected and engaged with our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.4, ease: "easeOut" }}
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#31757A] hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#1F2E2E] mb-2 sm:mb-3">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  {service.description}
                </p>

                <ul className="space-y-1.5 sm:space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#E3F9F9] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#31757A] text-xs">✓</span>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Additional Services
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.6, duration: 0.4, ease: "easeOut" }}
                className="text-center p-6 sm:p-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#31757A] to-[#41A4A7] mb-4 sm:mb-6 shadow-lg">
                  <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1F2E2E] mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
            >
              <img
                src="/src/assets/Images/banner-1.jpg"
                alt="Community Services"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-4 sm:mb-6">
                Why Choose Our Platform?
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] rounded-full mb-4 sm:mb-6" />
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Modern, user-friendly interface',
                  'Secure data management',
                  'Mobile-responsive design',
                  'Real-time notifications',
                  'Transparent financial tracking',
                  'Active community engagement',
                  'Regular updates and improvements',
                  'Dedicated support team',
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-linear-to-br from-[#31757A] to-[#1F2E2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join our digital platform today and experience seamless community management
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

export default ServicesPage;
