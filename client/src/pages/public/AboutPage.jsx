/**
 * About Page - Executive Members & Mission
 */

import { motion } from 'framer-motion';
import { PhoneIcon, UserGroupIcon, CheckCircleIcon, HeartIcon } from '@heroicons/react/24/outline';
import banner2 from '../../assets/Images/banner-2.jpg';

const AboutPage = () => {
  // Executive Members Data
  const executiveMembers = [
    {
      name: 'S SHAJEER HAJI',
      role: 'President',
      address: 'Valiyaveedu, Thoppil, Thonnakkal P O',
      phone: '+91-984 70 29580',
    },
    {
      name: 'MAHEEN BAQAVI',
      role: 'Secretary',
      address: 'Shah Nivas, Kochalammoodu, Pothencode P O',
      phone: '+91-703 48 29292',
    },
    {
      name: 'SAJEER E',
      role: 'Treasurer',
      address: 'Shajeer Manzil, Koithoorkonam P O',
      phone: '+91-889 11 77845',
    },
    {
      name: 'HASHID H',
      role: 'Joint Secretary',
      address: 'Kalloor',
      phone: '+91-904 83 38959',
    },
    {
      name: 'SHAJAHAN A',
      role: 'Vice President',
      phone: '+91-854 70 29237',
    },
    {
      name: 'SALAHUDEEN',
      role: 'Team Member',
      phone: '+91-854 70 29237',
    },
    {
      name: 'NOUSHAD M',
      role: 'Team Member',
      phone: '+91-940 03 22984',
    },
    {
      name: 'ABDUL LATHEEF',
      role: 'Team Member',
      phone: '+91-964 51 61612',
    },
    {
      name: 'ABDUL JALEEL',
      role: 'Team Member',
      phone: '+91-860 60 34475',
    },
    {
      name: 'ABDUL JABBAR',
      role: 'Team Member',
      phone: '+91-952 67 10135',
    },
    {
      name: 'NASEER',
      role: 'Team Member',
      phone: '+91-984 75 13001',
    },
    {
      name: 'ELLYAS',
      role: 'Team Member',
      phone: '+91-940 03 22984',
    },
    {
      name: 'ABDUL RAHEEM',
      role: 'Team Member',
      phone: '+91-755 98 84825',
    },
    {
      name: 'ABDUL AZEEZ',
      role: 'Team Member',
      phone: '+91-944 68 46179',
    },
    {
      name: 'ANSAR',
      role: 'Team Member',
      phone: '+91-860 60 34475',
    },
    {
      name: 'ABDUL SHUKKOOR',
      role: 'Team Member',
      phone: '+91-984 75 62109',
    },
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Faith & Unity',
      description: 'Building stronger bonds through Islamic values and community support',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Service',
      description: 'Dedicated to serving our members and supporting families in need',
    },
    {
      icon: CheckCircleIcon,
      title: 'Transparency',
      description: 'Open communication and clear management of community resources',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#31757A] to-[#1F2E2E] py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              About Us
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Learn about our mission, values, and the dedicated team serving our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-full"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-4 sm:mb-6">
                Our Mission
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] rounded-full mb-4 sm:mb-6" />
              <p className="text-lg sm:text-xl text-[#31757A] font-semibold mb-3 sm:mb-4">
                صلي الله على محمد صلى الله عليه وسلم
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                Kalloor Masjid Jama-ath has been serving the Muslim community for over five decades, 
                fostering unity, faith, and mutual support among families.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                Our executive members work tirelessly to ensure the welfare of all community members, 
                organizing events, managing resources, and maintaining transparent communication.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Through our digital platform, we're bringing traditional community values into the modern age, 
                making it easier for members to stay connected and participate in community activities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="mt-8 lg:mt-0 max-w-full"
            >
              <img
                src={banner2}
                alt="Kalloor Masjid"
                className="rounded-2xl shadow-xl w-full h-64 sm:h-80 lg:h-full object-cover max-w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              Our Core Values
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4, ease: "easeOut" }}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center mb-4 sm:mb-6">
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1F2E2E] mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Members Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E2E] mb-3 sm:mb-4">
              KMJ Executive Members
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] mx-auto rounded-full mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-gray-600 px-4">
              ജമാഅത്ത് 2022-2024 പരിപാലന സമിതി അംഗങ്ങൾ
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {executiveMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index % 8) * 0.05, duration: 0.4, ease: "easeOut" }}
                className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:border-[#31757A] hover:shadow-lg transition-all duration-300 min-w-0"
              >
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-[#31757A] to-[#41A4A7] text-white text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  {member.name.charAt(0)}
                </div>
                <div className="text-center">
                  <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#E3F9F9] text-[#31757A] text-xs font-semibold mb-2 max-w-full truncate">
                    {member.role}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-[#1F2E2E] mb-2">
                    {member.name}
                  </h3>
                  {member.address && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 wrap-break-words">
                      {member.address}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[#31757A] mt-2 sm:mt-3 min-w-0">
                    <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium break-all">{member.phone}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
