/**
 * Member Detail Modal
 * Displays comprehensive member information
 */

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  CreditCardIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '../common';
import { formatDate, cn } from '../../lib/utils';

const MemberDetailModal = ({ isOpen, onClose, member, onEdit }) => {
  if (!member) return null;

  const InfoRow = ({ icon: Icon, label, value, badge = false, badgeVariant = 'default' }) => (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-linear-to-br from-[#E3F9F9] to-white rounded-lg">
        <Icon className="h-5 w-5 text-[#31757A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {badge && value ? (
          <Badge variant={badgeVariant} className="mt-1">
            {value}
          </Badge>
        ) : (
          <p className="text-base font-medium text-gray-900 mt-0.5">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-[#1F2E2E] mb-4 flex items-center gap-2">
        <span className="h-1 w-8 bg-linear-to-r from-[#31757A] to-[#41A4A7] rounded-full"></span>
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-linear-to-r from-[#31757A] to-[#41A4A7] px-8 py-6 text-white">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  
                  <div className="flex items-center gap-6">
                    <div className="shrink-0">
                      <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white/30">
                        {member.Fname?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Dialog.Title className="text-3xl font-bold">
                        {member.Fname}
                      </Dialog.Title>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="default" className="bg-white/20 text-white border-white/30">
                          ID: {member.Mid}
                        </Badge>
                        <Badge 
                          variant={member.Gender === 'Male' ? 'info' : 'warning'} 
                          className="bg-white/20 text-white border-white/30"
                        >
                          {member.Gender}
                        </Badge>
                        {member.Relation && (
                          <Badge variant="success" className="bg-white/20 text-white border-white/30">
                            {member.Relation}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(member._id);
                          onClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-[#31757A] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <PencilIcon className="h-5 w-5" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-8">
                  {/* Personal Information */}
                  <Section title="Personal Information">
                    <InfoRow 
                      icon={UserIcon} 
                      label="Full Name" 
                      value={member.Fname} 
                    />
                    <InfoRow 
                      icon={CalendarIcon} 
                      label="Date of Birth" 
                      value={member.Dob ? formatDate(member.Dob) : null} 
                    />
                    <InfoRow 
                      icon={UserIcon} 
                      label="Gender" 
                      value={member.Gender}
                      badge
                      badgeVariant={member.Gender === 'Male' ? 'info' : 'warning'}
                    />
                    <InfoRow 
                      icon={UserIcon} 
                      label="Relation to Head" 
                      value={member.Relation} 
                    />
                    <InfoRow 
                      icon={HeartIcon} 
                      label="Marital Status" 
                      value={member.Mstatus} 
                    />
                  </Section>

                  {/* Contact Information */}
                  <Section title="Contact Information">
                    <InfoRow 
                      icon={PhoneIcon} 
                      label="Mobile Number" 
                      value={member.Mobile} 
                    />
                    <InfoRow 
                      icon={EnvelopeIcon} 
                      label="Email Address" 
                      value={member.Email} 
                    />
                    <InfoRow 
                      icon={CreditCardIcon} 
                      label="Aadhaar Number" 
                      value={member.Aadhaar} 
                    />
                  </Section>

                  {/* Address Information */}
                  <Section title="Address Information">
                    <InfoRow 
                      icon={HomeIcon} 
                      label="Full Address" 
                      value={member.Address} 
                    />
                    <InfoRow 
                      icon={MapPinIcon} 
                      label="Mahal Ward" 
                      value={member.Mward ? `Ward ${member.Mward}` : null} 
                    />
                    <InfoRow 
                      icon={BuildingOfficeIcon} 
                      label="Panchayath Ward/House" 
                      value={member.Phouse} 
                    />
                    <InfoRow 
                      icon={MapPinIcon} 
                      label="Panchayath Name" 
                      value={member.Pward} 
                    />
                    <InfoRow 
                      icon={MapPinIcon} 
                      label="District" 
                      value={member.Dist} 
                    />
                    <InfoRow 
                      icon={BuildingOfficeIcon} 
                      label="Area Type" 
                      value={member.Area} 
                    />
                  </Section>

                  {/* Professional & Educational Information */}
                  <Section title="Professional & Education">
                    <InfoRow 
                      icon={BriefcaseIcon} 
                      label="Occupation" 
                      value={member.Occupation} 
                    />
                    <InfoRow 
                      icon={AcademicCapIcon} 
                      label="Education Level" 
                      value={member.Education} 
                    />
                    <InfoRow 
                      icon={AcademicCapIcon} 
                      label="Madrassa Education" 
                      value={member.Madrassa} 
                    />
                  </Section>

                  {/* Other Information */}
                  <Section title="Other Information">
                    <InfoRow 
                      icon={CreditCardIcon} 
                      label="Ration Card Type" 
                      value={member.RC} 
                    />
                    <InfoRow 
                      icon={HeartIcon} 
                      label="Health Status" 
                      value={member.Health} 
                    />
                    <InfoRow 
                      icon={CalendarIcon} 
                      label="Member Since" 
                      value={member.Myear ? formatDate(member.Myear) : null} 
                    />
                    <InfoRow 
                      icon={HomeIcon} 
                      label="Land Ownership" 
                      value={member.Land}
                      badge
                      badgeVariant={member.Land === 'Yes' ? 'success' : 'default'}
                    />
                    <InfoRow 
                      icon={HomeIcon} 
                      label="House Ownership" 
                      value={member.House}
                      badge
                      badgeVariant={member.House === 'Yes' ? 'success' : 'default'}
                    />
                    <InfoRow 
                      icon={HomeIcon} 
                      label="Place of Residence" 
                      value={member.Resident}
                      badge
                      badgeVariant={member.Resident === 'Own' ? 'success' : 'warning'}
                    />
                  </Section>

                  {/* Registration Info */}
                  <div className="mt-8 pt-6 border-t-2 border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Registered: {member.createdAt ? formatDate(member.createdAt) : 'N/A'}
                      </span>
                      <span>
                        Last Updated: {member.updatedAt ? formatDate(member.updatedAt) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(member._id);
                        onClose();
                      }}
                      className="px-6 py-2 bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Edit Member
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MemberDetailModal;
