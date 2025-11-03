/**
 * Events Page - Community Events & Gallery
 */

import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

const EventsPage = () => {
  // Upcoming Events
  const upcomingEvents = [
    {
      title: 'Friday Jumu\'ah Prayer',
      date: 'Every Friday',
      time: '1:00 PM - 2:00 PM',
      location: 'Kalloor Masjid',
      description: 'Weekly congregational prayer and sermon',
      attendees: '200+',
    },
    {
      title: 'Community Iftar',
      date: 'During Ramadan',
      time: '6:30 PM onwards',
      location: 'Kalloor Masjid',
      description: 'Breaking fast together as a community',
      attendees: '300+',
    },
    {
      title: 'Eid Celebration',
      date: 'Eid al-Fitr & Eid al-Adha',
      time: '7:00 AM onwards',
      location: 'Kalloor Masjid Ground',
      description: 'Eid prayer followed by community gathering',
      attendees: '500+',
    },
    {
      title: 'Islamic Education Classes',
      date: 'Every Weekend',
      time: '9:00 AM - 11:00 AM',
      location: 'Masjid Classroom',
      description: 'Quran and Islamic studies for children and adults',
      attendees: '50+',
    },
    {
      title: 'Community Meeting',
      date: 'Monthly',
      time: 'TBA',
      location: 'Kalloor Masjid',
      description: 'Discuss community matters and upcoming plans',
      attendees: '100+',
    },
    {
      title: 'Charity Drive',
      date: 'Quarterly',
      time: 'All Day',
      location: 'Various Locations',
      description: 'Supporting families in need within our community',
      attendees: 'All Members',
    },
  ];

  // Past Events Gallery
  const galleryImages = [
    { id: 1, image: '/src/assets/Images/banner-1.jpg', title: 'Community Gathering' },
    { id: 2, image: '/src/assets/Images/banner-2.jpg', title: 'Masjid View' },
    { id: 3, image: '/src/assets/Images/banner-4.jpg', title: 'Prayer Time' },
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
              Community Events
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Stay connected with our community through regular events, prayers, and gatherings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Upcoming Events
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Join us in our regular community activities and special occasions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.4, ease: "easeOut" }}
                className="bg-white border-2 border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-[#31757A] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-[#1F2E2E] leading-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A] shrink-0" />
                    <span className="text-xs sm:text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A] shrink-0" />
                    <span className="text-xs sm:text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A] shrink-0" />
                    <span className="text-xs sm:text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A] shrink-0" />
                    <span className="text-xs sm:text-sm">{event.attendees} attendees</span>
                  </div>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {event.description}
                </p>

                <button className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white font-semibold hover:shadow-lg transition-all duration-300">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Event Gallery
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Moments from our community events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {galleryImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.6, duration: 0.4, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1F2E2E]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 sm:p-6">
                  <h3 className="text-white font-bold text-lg sm:text-xl">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-[#31757A] to-[#1F2E2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Want to Stay Updated?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 px-4">
              Register as a member to receive notifications about upcoming events and community activities
            </p>
            <button className="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white text-[#31757A] font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Register Now
            </button>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default EventsPage;
