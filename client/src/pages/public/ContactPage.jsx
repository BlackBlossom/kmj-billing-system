/**
 * Contact Page - Get in Touch
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const ContactPage = () => {
  const location = useLocation();

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Location',
      details: 'Kalloor, Kerala, India',
      link: null,
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: '+91-703 48 29292',
      link: 'tel:+917034829292',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: 'kmjsecretary@kmjinfo.com',
      secondaryDetails: 'kalloormuslimjamath@gmail.com',
      link: 'mailto:kmjsecretary@kmjinfo.com',
    },
    {
      icon: ClockIcon,
      title: 'Office Hours',
      details: 'Sunday - Thursday',
      secondaryDetails: '9:00 AM - 5:00 PM',
      link: null,
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
              Contact Us
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
              We're here to help. Reach out to us for any questions or support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.4, ease: "easeOut" }}
                className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:border-[#31757A] hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7] mb-3 sm:mb-4">
                  <info.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-bold text-[#1F2E2E] mb-2 text-sm sm:text-base">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 hover:text-[#31757A] transition-colors text-xs sm:text-sm break-all"
                  >
                    {info.details}
                  </a>
                ) : (
                  <p className="text-gray-600 text-xs sm:text-sm">{info.details}</p>
                )}
                {info.secondaryDetails && (
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {info.secondaryDetails}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2E2E] mb-4 sm:mb-6">
                  Send us a Message
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] rounded-full mb-6 sm:mb-8" />

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-[#31757A] focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-[#31757A] focus:outline-none transition-colors"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-[#31757A] focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-[#31757A] focus:outline-none transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-lg bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0!2d76.9!3d8.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMDAuMCJOIDc2wrA1NCcwMC4wIkU!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kalloor Masjid Location"
                />
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
                  Visit Us
                </h3>
                <div className="w-12 sm:w-16 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] rounded-full mb-4 sm:mb-6" />
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Our office is open to serve you during business hours. Feel free to visit us
                  for any inquiries, membership registration, or community matters.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E3F9F9] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#31757A] text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm sm:text-base text-gray-600">Easy accessibility</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E3F9F9] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#31757A] text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm sm:text-base text-gray-600">Parking available</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E3F9F9] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#31757A] text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm sm:text-base text-gray-600">Friendly staff</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full" />
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: 'How do I register as a member?',
                a: 'You can register online through our website by clicking the "Register" button in the navigation menu. Fill out the registration form with your details and submit it for approval.',
              },
              {
                q: 'What are the membership fees?',
                a: 'Membership fees vary based on family size and contribution preference. Please contact our office or check your member dashboard for specific details.',
              },
              {
                q: 'How can I pay my bills?',
                a: 'You can pay bills online through your member dashboard using various payment methods including bank transfer, UPI, or card payments.',
              },
              {
                q: 'How do I stay updated about events?',
                a: 'Members receive notifications through the platform, email, and SMS about upcoming events and community announcements.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.6, duration: 0.4, ease: "easeOut" }}
                className="bg-gray-50 rounded-xl p-4 sm:p-6"
              >
                <h3 className="font-bold text-sm sm:text-base text-[#1F2E2E] mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
