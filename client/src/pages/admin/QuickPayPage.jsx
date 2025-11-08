/**
 * Quick Pay Page
 * Fast billing/payment entry for members
 * Based on old Bill.php with modern UI
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CreditCardIcon,
  PrinterIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Badge } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';
import { searchMembers } from '../../services/memberService';
import { createBill, getMemberBills, ACCOUNT_TYPES, numberToWords } from '../../services/billService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const QuickPayPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    accountType: '',
    paymentMethod: 'Cash',
    notes: '',
  });
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastBillId, setLastBillId] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Search members
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await searchMembers(searchQuery);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.error('No members found');
      }
    } catch (error) {
      console.error('Error searching members:', error);
      toast.error('Search failed');
    }
  };

  // Select member
  const handleSelectMember = async (member) => {
    setSelectedMember(member);
    setSearchResults([]);
    setSearchQuery('');

    // Fetch recent bills
    try {
      const response = await getMemberBills(member.Mid, { limit: 5 });
      setRecentBills(response.data.bills || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMember) {
      toast.error('Please select a member');
      return;
    }

    if (!paymentForm.amount || !paymentForm.accountType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await createBill({
        mahalId: selectedMember.Mid,
        amount: parseFloat(paymentForm.amount),
        accountType: paymentForm.accountType,
        paymentMethod: paymentForm.paymentMethod,
        notes: paymentForm.notes,
      });

      toast.success('Payment recorded successfully!');
      setLastBillId(response.data._id);
      setShowReceipt(true);

      // Reset form
      setPaymentForm({
        amount: '',
        accountType: '',
        paymentMethod: 'Cash',
        notes: '',
      });

      // Refresh recent bills
      const billsResponse = await getMemberBills(selectedMember.Mid, { limit: 5 });
      setRecentBills(billsResponse.data.bills || []);
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Print receipt
  const handlePrint = () => {
    if (lastBillId) {
      window.open(`/admin/receipt/${lastBillId}`, '_blank', 'width=800,height=600');
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
        <h1 className="text-3xl font-bold text-neutral-900">Quick Pay</h1>
        <p className="text-neutral-600 mt-1">
          Fast payment entry system
        </p>
        <div className="mt-2 text-sm text-primary-600 font-medium">
          {currentDateTime.toLocaleString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Search */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideDown}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <Card.Header>
                <Card.Title>Search Member</Card.Title>
                <Card.Description>
                  Search by Mahal ID, Name, Aadhaar, or Phone
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Mahal ID or search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {searchResults.map((member) => (
                      <div
                        key={member._id}
                        onClick={() => handleSelectMember(member)}
                        className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-neutral-900">{member.Fname}</p>
                            <p className="text-sm text-neutral-600">
                              ID: {member.Mid} | Aadhaar: {member.Aadhaar}
                            </p>
                          </div>
                          <Badge variant="primary">{member.Gender}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Member */}
                {selectedMember && (
                  <div className="mt-4 p-4 bg-linear-to-r from-primary-50 to-cyan-50 border border-primary-200 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-2">Selected Member</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-600">Mahal ID:</span>
                        <span className="ml-2 font-medium text-primary-600">{selectedMember.Mid}</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedMember.Fname}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-neutral-600">Address:</span>
                        <span className="ml-2">{selectedMember.Address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>

          {/* Payment Form */}
          {selectedMember && (
            <motion.div
              variants={ANIMATION_VARIANTS.slideUp}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <Card.Header className="bg-primary-600 text-white">
                  <Card.Title>Payment Details</Card.Title>
                </Card.Header>
                <form onSubmit={handleSubmit}>
                  <Card.Content className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Account Type (16 types from old system) */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-3">
                          Account Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {ACCOUNT_TYPES.map((type) => (
                            <label
                              key={type.value}
                              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                paymentForm.accountType === type.value
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-neutral-200 hover:border-primary-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="accountType"
                                value={type.value}
                                checked={paymentForm.accountType === type.value}
                                onChange={handleFormChange}
                                className="mr-2"
                              />
                              <span className="text-sm">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Amount */}
                      <div>
                        <Input
                          label="Amount"
                          name="amount"
                          type="number"
                          value={paymentForm.amount}
                          onChange={handleFormChange}
                          required
                          placeholder="Enter amount"
                          min="1"
                        />
                        {paymentForm.amount && (
                          <p className="mt-1 text-sm text-red-600 font-medium">
                            {numberToWords(paymentForm.amount)}
                          </p>
                        )}
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          name="paymentMethod"
                          value={paymentForm.paymentMethod}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select Method</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      {/* Notes */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          name="notes"
                          value={paymentForm.notes}
                          onChange={handleFormChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Additional notes..."
                        />
                      </div>
                    </div>
                  </Card.Content>

                  <Card.Footer className="flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedMember(null)}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      leftIcon={<CreditCardIcon className="h-5 w-5" />}
                    >
                      Record Payment
                    </Button>
                  </Card.Footer>
                </form>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Section - Recent Bills & Summary */}
        <div className="space-y-6">
          {/* Receipt Modal Success */}
          {showReceipt && (
            <motion.div
              variants={ANIMATION_VARIANTS.slideRight}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-green-50 border-green-200">
                <Card.Content className="py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Payment Successful!</h3>
                      <p className="text-sm text-green-700">Amount has been credited</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<PrinterIcon className="h-4 w-4" />}
                      onClick={handlePrint}
                      fullWidth
                    >
                      Print Receipt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReceipt(false)}
                      fullWidth
                    >
                      Close
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          )}

          {/* Recent Bills */}
          {selectedMember && recentBills.length > 0 && (
            <motion.div
              variants={ANIMATION_VARIANTS.slideRight}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <Card.Header>
                  <Card.Title>Recent Bills</Card.Title>
                  <Card.Description>
                    Last 5 transactions
                  </Card.Description>
                </Card.Header>
                <Card.Content className="p-0">
                  <div className="space-y-2 p-4">
                    {recentBills.map((bill) => (
                      <div
                        key={bill._id}
                        className="p-3 border border-neutral-200 rounded-lg hover:border-primary-300 cursor-pointer transition-all"
                        onClick={() => navigate(`/admin/receipt/${bill._id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-neutral-900">
                            {bill.accountType}
                          </span>
                          <span className="text-sm font-bold text-primary-600">
                            {formatCurrency(bill.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>Receipt: {bill.receiptNo}</span>
                          <span>{formatDate(bill.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => navigate(`/admin/bills?mahalId=${selectedMember.Mid}`)}
                  >
                    View All Bills
                  </Button>
                </Card.Footer>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideRight}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    leftIcon={<ClockIcon className="h-5 w-5" />}
                    fullWidth
                    onClick={() => navigate('/admin/bills')}
                  >
                    View All Bills
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<CreditCardIcon className="h-5 w-5" />}
                    fullWidth
                    onClick={() => navigate('/admin/members')}
                  >
                    View Members
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuickPayPage;
