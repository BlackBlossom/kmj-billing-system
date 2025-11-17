/**
 * Bills Page
 * View and manage user bills
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReceiptRefundIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
  BanknotesIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Badge } from '../../components/common';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.config';

const BillsPage = () => {
  const { user } = useAuthStore();
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [searchQuery, statusFilter, bills]);

  const fetchBills = async () => {
    try {
      // URL encode memberId to handle forward slashes (e.g., "1/2" -> "1%2F2")
      const encodedMemberId = encodeURIComponent(user.memberId);
      
      // Axios interceptor already unwraps response.data
      const response = await axiosInstance.get(`/bills/member/${encodedMemberId}`);
      if (response.success) {
        // Backend returns: { success: true, data: { bills, totalBills, totalAmountPaid, pagination } }
        const billsData = response.data.bills.map(bill => ({
          id: bill._id,
          receiptNo: bill.receiptNo || 'N/A',
          accountType: bill.type || bill.accountType || 'General',
          amount: parseFloat(bill.amount) || 0,
          status: bill.status || 'paid',
          paidDate: bill.Date_time || bill.createdAt,
          dueDate: bill.Date_time || bill.createdAt,
          description: bill.notes || bill.id_name_address || `${bill.type || 'Payment'} - ${bill.amount}`,
        }));
        setBills(billsData);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error(error.message || 'Failed to load bills');
    }
  };

  const filterBills = () => {
    let filtered = bills;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((bill) => bill.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bill) =>
          bill.receiptNo.toLowerCase().includes(query) ||
          bill.accountType.toLowerCase().includes(query) ||
          bill.description.toLowerCase().includes(query)
      );
    }

    setFilteredBills(filtered);
  };

  const handlePayBill = async (billId) => {
    if (!window.confirm('Proceed to payment?')) return;

    setLoading(true);
    try {
      // In a real implementation, this would redirect to a payment gateway
      toast.info('Payment feature coming soon! Please contact admin for payments.');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (billId) => {
    try {
      // Note: axios interceptor unwraps response.data, but for blob responses it returns the raw data
      const response = await axiosInstance.get(`/bills/${billId}/receipt`, {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download receipt');
    }
  };

  const stats = [
    {
      label: 'Total Bills',
      value: bills.length,
      icon: ReceiptRefundIcon,
      bgColor: 'bg-[#31757A]',
    },
    {
      label: 'Paid',
      value: bills.filter((b) => b.status === 'paid').length,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-600',
    },
    {
      label: 'Pending',
      value: bills.filter((b) => b.status === 'pending').length,
      icon: ClockIcon,
      bgColor: 'bg-orange-600',
    },
    {
      label: 'Total Amount',
      value: `₹${bills.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}`,
      icon: BanknotesIcon,
      bgColor: 'bg-blue-600',
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7]">
            <ReceiptRefundIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#31757A] to-[#41A4A7] bg-clip-text text-transparent">
            My Bills
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          View and manage your billing information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#1F2E2E]">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-xl ${stat.bgColor}`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="mb-4 sm:mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by receipt number, account type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-colors"
              >
                <option value="all">All Bills</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Bills List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBills.map((bill, index) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg hover:border-[#31757A] transition-all duration-200">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Bill Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div
                          className={`p-1.5 sm:p-2 rounded-lg ${
                            bill.status === 'paid'
                              ? 'bg-green-100'
                              : 'bg-orange-100'
                          }`}
                        >
                          {bill.status === 'paid' ? (
                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          ) : (
                            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#1F2E2E] text-base sm:text-lg truncate">
                            {bill.receiptNo}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {bill.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Account Type</p>
                          <Badge className="bg-[#E3F9F9] text-[#31757A] text-xs">
                            {bill.accountType}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Amount</p>
                          <p className="font-bold text-[#1F2E2E] text-sm sm:text-base">
                            ₹{bill.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Due Date</p>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(bill.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        {bill.paidDate && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Paid Date</p>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-green-700">
                              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              {new Date(bill.paidDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {bill.status === 'pending' ? (
                        <Button
                          onClick={() => handlePayBill(bill.id)}
                          disabled={loading}
                          className="bg-[#31757A] hover:bg-[#41A4A7] whitespace-nowrap text-sm"
                          size="sm"
                        >
                          <CreditCardIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                          Pay Now
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleDownloadReceipt(bill.id)}
                          variant="outline"
                          className="border-[#31757A] text-[#31757A] hover:bg-[#E3F9F9] whitespace-nowrap text-sm"
                          size="sm"
                        >
                          <ArrowDownTrayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                          Receipt
                        </Button>
                      )}
                      <Button
                        onClick={() => setSelectedBill(bill)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBills.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <ReceiptRefundIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bills found
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You have no bills at the moment'}
            </p>
          </div>
        </Card>
      )}

      {/* Bill Detail Modal */}
      <AnimatePresence>
        {selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F2E2E]">
                    Bill Details
                  </h2>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">Receipt Number</span>
                  <span className="font-bold text-[#1F2E2E]">
                    {selectedBill.receiptNo}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge className="bg-[#E3F9F9] text-[#31757A]">
                    {selectedBill.accountType}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge
                    className={
                      selectedBill.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }
                  >
                    {selectedBill.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-bold text-[#1F2E2E] text-lg">
                    ₹{selectedBill.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="font-semibold text-[#1F2E2E]">
                    {new Date(selectedBill.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {selectedBill.paidDate && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-600">Paid Date</span>
                    <span className="font-semibold text-green-700">
                      {new Date(selectedBill.paidDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600 block mb-2">
                    Description
                  </span>
                  <p className="text-[#1F2E2E]">{selectedBill.description}</p>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-3">
                {selectedBill.status === 'pending' ? (
                  <Button
                    onClick={() => handlePayBill(selectedBill.id)}
                    disabled={loading}
                    className="flex-1 bg-[#31757A] hover:bg-[#41A4A7] text-sm"
                  >
                    <CreditCardIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Pay Now
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleDownloadReceipt(selectedBill.id)}
                    className="flex-1 bg-[#31757A] hover:bg-[#41A4A7] text-sm"
                  >
                    <ArrowDownTrayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedBill(null)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default BillsPage;
