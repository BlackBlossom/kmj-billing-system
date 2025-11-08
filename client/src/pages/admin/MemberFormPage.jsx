/**
 * Add/Edit Member Form
 * Comprehensive census form with 25 fields
 * Based on old membership.php with modern UI
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { createMember, updateMember, getMemberById } from '../../services/memberService';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const MemberFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    Mid: user?.memberId || '',
    Fname: '',
    Dob: '',
    Gender: 'Male',
    Relation: '',
    Mstatus: 'Single',
    Occupation: 'Student',
    Designation: '',
    RC: 'White',
    Education: '',
    Madrassa: '',
    Aadhaar: '',
    Mobile: '',
    Email: '',
    Health: 'Not Required',
    Myear: '',
    
    // Residence Details
    Pward: '',
    Phouse: '',
    Dist: '',
    Area: 'Panchayath',
    Land: 'Yes',
    House: 'Yes',
    Resident: 'Own',
    Address: user?.address || '',
    Mward: user?.ward || '',
  });

  // Fetch member data if editing
  useEffect(() => {
    if (isEdit) {
      fetchMemberData();
    }
  }, [id]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await getMemberById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching member:', error);
      toast.error('Failed to load member data');
      navigate('/admin/members');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.Fname || !formData.Dob || !formData.Aadhaar) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateMember(id, formData);
        toast.success('Member updated successfully');
      } else {
        await createMember(formData);
        toast.success('Member added successfully');
      }
      navigate('/admin/members');
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error(error.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            onClick={() => navigate('/admin/members')}
          >
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">
          {isEdit ? 'Edit Member' : 'Add New Member'}
        </h1>
        <p className="text-neutral-600 mt-1">
          {isEdit ? 'Update member information' : 'Register new census entry'}
        </p>
      </motion.div>

      {/* User Info Card (for reference) */}
      {!isEdit && (
        <motion.div
          variants={ANIMATION_VARIANTS.slideDown}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <Card className="bg-linear-to-r from-primary-50 to-cyan-50 border-primary-200">
            <Card.Content className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-neutral-900">Family Information</h5>
                  <p className="text-sm text-neutral-600 mt-1">
                    Mahal ID: <span className="font-medium text-primary-600">{user?.memberId}</span> | 
                    Name: <span className="font-medium">{user?.name}</span> | 
                    Ward/House: <span className="font-medium">{user?.ward}/{user?.houseNo}</span>
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Personal Details Section */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="mb-6">
            <Card.Header className="bg-primary-600 text-white">
              <Card.Title>Personal Details</Card.Title>
            </Card.Header>
            <Card.Content className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Full Name */}
                <Input
                  label="Full Name"
                  name="Fname"
                  value={formData.Fname}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />

                {/* Date of Birth */}
                <Input
                  label="Date of Birth"
                  name="Dob"
                  type="date"
                  value={formData.Dob}
                  onChange={handleChange}
                  required
                />

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="Gender"
                        value="Male"
                        checked={formData.Gender === 'Male'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="Gender"
                        value="Female"
                        checked={formData.Gender === 'Female'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="Gender"
                        value="Other"
                        checked={formData.Gender === 'Other'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>

                {/* Relationship */}
                <Input
                  label="Relationship"
                  name="Relation"
                  value={formData.Relation}
                  onChange={handleChange}
                  placeholder="e.g., Head, Spouse, Son"
                />

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    name="Mstatus"
                    value={formData.Mstatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widow">Widow</option>
                    <option value="Widower">Widower</option>
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation
                  </label>
                  <select
                    name="Occupation"
                    value={formData.Occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Occupation</option>
                    <option value="Student">Student</option>
                    <option value="PVT Employee">PVT Employee</option>
                    <option value="Govt Employee">Govt Employee</option>
                    <option value="Abroad">Abroad</option>
                    <option value="Self Employee">Self Employee</option>
                    <option value="House Wife">House Wife</option>
                    <option value="Business">Business</option>
                    <option value="Masjid Emam / Madrassa Teacher">Masjid Emam / Madrassa Teacher</option>
                    <option value="PVT/Govt Pensioner">PVT/Govt Pensioner</option>
                    <option value="Other">Other</option>
                    <option value="Nill">Nill</option>
                  </select>
                </div>

                {/* Designation */}
                <Input
                  label="Designation/Department"
                  name="Designation"
                  value={formData.Designation}
                  onChange={handleChange}
                  placeholder="If applicable"
                />

                {/* Ration Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ration Card
                  </label>
                  <select
                    name="RC"
                    value={formData.RC}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Card Type</option>
                    <option value="White">White</option>
                    <option value="Blue">Blue</option>
                    <option value="Pink">Pink</option>
                    <option value="Yellow">Yellow</option>
                  </select>
                </div>

                {/* Education */}
                <Input
                  label="Education"
                  name="Education"
                  value={formData.Education}
                  onChange={handleChange}
                  placeholder="e.g., SSLC, Plus Two, Degree"
                />

                {/* Madrassa Education */}
                <Input
                  label="Madrassa Education"
                  name="Madrassa"
                  value={formData.Madrassa}
                  onChange={handleChange}
                  placeholder="If applicable"
                />

                {/* Aadhaar */}
                <Input
                  label="Aadhaar Number"
                  name="Aadhaar"
                  value={formData.Aadhaar}
                  onChange={handleChange}
                  required
                  placeholder="12-digit Aadhaar"
                  maxLength={12}
                />

                {/* Mobile */}
                <Input
                  label="Mobile Number"
                  name="Mobile"
                  value={formData.Mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  maxLength={10}
                />

                {/* Email */}
                <Input
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />

                {/* Health */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Status
                  </label>
                  <select
                    name="Health"
                    value={formData.Health}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Health Status</option>
                    <option value="Not Required">Not Required</option>
                    <option value="Accident - Very Serious">Accident - Very Serious</option>
                    <option value="Cancer">Cancer</option>
                    <option value="Heart Treatment">Heart Treatment</option>
                    <option value="Kidney Disease">Kidney Disease</option>
                    <option value="Brain and Nervous System">Brain and Nervous System</option>
                    <option value="Others - Very Serious">Others - Very Serious</option>
                  </select>
                </div>

                {/* Member Since */}
                <Input
                  label="Member Since"
                  name="Myear"
                  type="date"
                  value={formData.Myear}
                  onChange={handleChange}
                />
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Residence Details Section */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="mb-6">
            <Card.Header className="bg-primary-600 text-white">
              <Card.Title>Residence Details</Card.Title>
            </Card.Header>
            <Card.Content className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Panchayath Name */}
                <Input
                  label="Panchayath Name"
                  name="Pward"
                  value={formData.Pward}
                  onChange={handleChange}
                />

                {/* Panchayath Ward/House */}
                <Input
                  label="Panchayath Ward/House No"
                  name="Phouse"
                  value={formData.Phouse}
                  onChange={handleChange}
                />

                {/* District */}
                <Input
                  label="District"
                  name="Dist"
                  value={formData.Dist}
                  onChange={handleChange}
                  placeholder="e.g., Ernakulam"
                />

                {/* Area Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Area Type
                  </label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="Area"
                        value="Corporation"
                        checked={formData.Area === 'Corporation'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Corporation
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="Area"
                        value="Municipality"
                        checked={formData.Area === 'Municipality'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Municipality
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="Area"
                        value="Panchayath"
                        checked={formData.Area === 'Panchayath'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Panchayath
                    </label>
                  </div>
                </div>

                {/* Land Ownership */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Ownership
                  </label>
                  <select
                    name="Land"
                    value={formData.Land}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* House Ownership */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Ownership
                  </label>
                  <select
                    name="House"
                    value={formData.House}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Place of Residence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place of Residence
                  </label>
                  <select
                    name="Resident"
                    value={formData.Resident}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="Own">Own</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Full Address */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Address
                  </label>
                  <textarea
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Complete address with pincode"
                  />
                </div>
              </div>
            </Card.Content>

            {/* Form Actions */}
            <Card.Footer className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/members')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                leftIcon={<CheckIcon className="h-5 w-5" />}
              >
                {isEdit ? 'Update Member' : 'Add Member'}
              </Button>
            </Card.Footer>
          </Card>
        </motion.div>
      </form>
    </AdminLayout>
  );
};

export default MemberFormPage;
