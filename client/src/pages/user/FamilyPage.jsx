/**
 * Family Members Page
 * View and manage family members
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  PhoneIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Avatar, Badge } from '../../components/common';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import familyService from '../../services/familyService';

const FamilyPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      // Axios interceptor already unwraps response.data
      const response = await familyService.getAll();
      if (response.success) {
        setFamilyMembers(response.data.members);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast.error(error.message || 'Failed to load family members');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this family member?')) {
      return;
    }

    try {
      // Axios interceptor already unwraps response.data
      const response = await familyService.delete(id);
      if (response.success) {
        toast.success(response.message || 'Family member removed successfully');
        fetchFamilyMembers();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to remove family member');
    }
  };

  const stats = [
    {
      label: 'Total Members',
      value: familyMembers.length,
      icon: UsersIcon,
      bgColor: 'bg-[#31757A]',
    },
    {
      label: 'Adults',
      value: familyMembers.filter((m) => m.age >= 18).length,
      icon: UserCircleIcon,
      bgColor: 'bg-blue-600',
    },
    {
      label: 'Children',
      value: familyMembers.filter((m) => m.age < 18).length,
      icon: CakeIcon,
      bgColor: 'bg-purple-600',
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7]">
                <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#31757A] to-[#41A4A7] bg-clip-text text-transparent">
                Family Members
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your family member information
            </p>
          </div>
          <Button
            onClick={() => navigate('/user/family/add')}
            className="bg-[#31757A] hover:bg-[#41A4A7] w-full sm:w-auto"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-[#1F2E2E]">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.bgColor}`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {familyMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-xl hover:border-[#31757A] transition-all duration-200">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={member.Fname}
                        size="lg"
                        className="ring-2 ring-[#E3F9F9]"
                      />
                      <div>
                        <h3 className="font-bold text-[#1F2E2E] text-lg">
                          {member.Fname}
                        </h3>
                        <Badge className="bg-[#E3F9F9] text-[#31757A] text-xs">
                          {member.Relation}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CakeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Age:</span>
                      <span className="font-semibold text-[#1F2E2E]">
                        {member.age || 'N/A'} {member.age ? 'years' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UserCircleIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-semibold text-[#1F2E2E]">
                        {member.Gender || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-[#1F2E2E]">
                        {member.Mobile || 'N/A'}
                      </span>
                    </div>
                    
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/user/family/edit/${member._id}`)}
                      className="w-full sm:flex-1 border-[#31757A] text-[#31757A] hover:bg-[#E3F9F9]"
                    >
                      <PencilIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(member._id)}
                      className="w-full sm:flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {familyMembers.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No family members yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first family member to get started
            </p>
            <Button
              onClick={() => navigate('/user/family/add')}
              className="bg-[#31757A] hover:bg-[#41A4A7]"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Member
            </Button>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
};

export default FamilyPage;
