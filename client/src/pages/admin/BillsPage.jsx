import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getAllBills, getBillStats, ACCOUNT_TYPES } from '../../services/billService';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Badge } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { cn } from '../../lib/utils';

const BillsPage = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    todayAmount: 0,
    monthAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    accountType: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBills: 0,
    limit: 20
  });

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'];

  // Fetch bills and stats
  useEffect(() => {
    fetchBills();
    fetchStats();
  }, [pagination.currentPage, filters]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await getAllBills(params);
      // Correct destructuring: response.data.data.bills
      const { bills, pagination: paginationData } = response.data;
      setBills(bills);
      setPagination(prev => ({
        ...prev,
        totalPages: paginationData.totalPages,
        totalBills: paginationData.totalBills
      }));
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getBillStats(filters);
      // Correct destructuring: response.data.overview
      const { overview } = response.data;
      setStats({
        totalBills: overview?.totalBills || 0,
        totalAmount: overview?.totalRevenue || 0,
        todayAmount: overview?.todayAmount || 0,
        monthAmount: overview?.monthAmount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, mahalId: searchQuery.trim() }));
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      accountType: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePrintReceipt = (billId) => {
    window.open(`/admin/receipt/${billId}`, '_blank');
  };

  const handleExportCSV = () => {
    // Prepare CSV data
    const headers = ['Receipt No', 'Date', 'Mahal ID', 'Member Name', 'Account Type', 'Amount', 'Payment Method'];
    const rows = bills.map(bill => [
      bill.receiptNo || 'N/A',
      new Date(bill.createdAt || bill.date || bill.Date).toLocaleDateString(),
      bill.mahalId || bill.Mahal_Id || bill.mahal_ID || 'N/A',
      'N/A', // Member name needs to be fetched from member reference
      bill.accountType || bill.category || 'N/A',
      bill.amount || 0,
      bill.paymentMethod || 'Cash'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Bills exported successfully');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      // EidAnual categories
      'Eid ul Adha': 'bg-pink-100 text-pink-800 border-pink-200',
      'Eid al-Fitr': 'bg-purple-100 text-purple-800 border-purple-200',
      'Dua_Friday': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      // Account types
      'Masjid': 'bg-blue-100 text-blue-800 border-blue-200',
      'Madrassa': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sadhu': 'bg-green-100 text-green-800 border-green-200',
      'Land': 'bg-amber-100 text-amber-800 border-amber-200',
      'Nercha': 'bg-pink-100 text-pink-800 border-pink-200',
      // Account discriminators
      'land': 'bg-amber-100 text-amber-800 border-amber-200',
      'madrassa': 'bg-purple-100 text-purple-800 border-purple-200',
      'nercha': 'bg-pink-100 text-pink-800 border-pink-200',
      'sadhu': 'bg-green-100 text-green-800 border-green-200',
      // Other categories
      'Donation': 'bg-teal-100 text-teal-800 border-teal-200',
      'Sunnath Fee': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Marriage Fee': 'bg-rose-100 text-rose-800 border-rose-200',
      'Product Turnover': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Rental_Basis': 'bg-orange-100 text-orange-800 border-orange-200',
      'Devotional Dedication': 'bg-violet-100 text-violet-800 border-violet-200',
      'Dead Fee': 'bg-slate-100 text-slate-800 border-slate-200',
      'New Membership': 'bg-sky-100 text-sky-800 border-sky-200',
      'Certificate Fee': 'bg-lime-100 text-lime-800 border-lime-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      'Cash': 'bg-green-50 text-green-700 border-green-200',
      'UPI': 'bg-purple-50 text-purple-700 border-purple-200',
      'Card': 'bg-blue-50 text-blue-700 border-blue-200',
      'Bank Transfer': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Cheque': 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return colors[method] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold leading-relaxed bg-linear-to-r from-[#1F2E2E] via-[#31757A] to-[#41A4A7] bg-clip-text text-transparent flex items-center gap-3">
              <DocumentTextIcon className="w-10 h-10 text-[#31757A]" />
              Billing Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Track and manage all billing transactions</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              leftIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
              onClick={handleExportCSV}
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-5 w-5" />}
              onClick={() => navigate('/admin/quick-pay')}
              className="bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A] shadow-lg hover:shadow-xl transition-all"
            >
              Quick Pay
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {/* <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Total Bills Card *
        <motion.div
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 p-6 shadow-xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <ChartBarIcon className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-blue-100 text-sm font-semibold mb-1">Total Bills</p>
            <p className="text-4xl font-bold text-white">{stats.totalBills}</p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-blue-100 text-xs">All time transactions</p>
            </div>
          </div>
        </motion.div>

        {/* Total Amount Card *
        <motion.div
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500 to-green-600 p-6 shadow-xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <BanknotesIcon className="w-8 h-8 text-white" />
              </div>
              <ChartBarIcon className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-green-100 text-sm font-semibold mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-white">{formatCurrency(stats.totalAmount)}</p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-green-100 text-xs">Total revenue collected</p>
            </div>
          </div>
        </motion.div>

        {/* Today's Collection Card *
        <motion.div
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 p-6 shadow-xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
              <ChartBarIcon className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-amber-100 text-sm font-semibold mb-1">Today's Collection</p>
            <p className="text-4xl font-bold text-white">{formatCurrency(stats.todayAmount)}</p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-amber-100 text-xs">Today's transactions</p>
            </div>
          </div>
        </motion.div>

        {/* This Month Card *
        <motion.div
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 p-6 shadow-xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <CreditCardIcon className="w-8 h-8 text-white" />
              </div>
              <ChartBarIcon className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-purple-100 text-sm font-semibold mb-1">This Month</p>
            <p className="text-4xl font-bold text-white">{formatCurrency(stats.monthAmount)}</p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-purple-100 text-xs">Monthly collection</p>
            </div>
          </div>
        </motion.div>
      </motion.div> */}

      {/* Search and Filter Bar */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="shadow-xl border-0 overflow-hidden">
          <Card.Content className="p-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Member ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-base"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A] shadow-md hover:shadow-lg transition-all px-8"
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                leftIcon={<FunnelIcon className="w-5 h-5" />}
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] transition-all shadow-sm hover:shadow-md",
                  showFilters && "bg-[#E3F9F9] border-[#31757A]"
                )}
              >
                Filters
                {Object.values(filters).filter(Boolean).length > 0 && (
                  <Badge variant="primary" className="ml-2 bg-[#31757A] text-white">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </form>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t-2 border-gray-100 pt-6 mt-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Account Type
                      </label>
                      <select
                        value={filters.accountType}
                        onChange={(e) => handleFilterChange('accountType', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      >
                        <option value="">All Types</option>
                        {ACCOUNT_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Payment Method
                      </label>
                      <select
                        value={filters.paymentMethod}
                        onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      >
                        <option value="">All Methods</option>
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        value={filters.minAmount}
                        onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                        placeholder="₹0"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        value={filters.maxAmount}
                        onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                        placeholder="₹10000"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      leftIcon={<XMarkIcon className="w-5 h-5" />}
                      onClick={clearFilters}
                      className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Bills Table */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden shadow-xl border-0">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <Card.Title className="text-xl font-bold text-[#1F2E2E] flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6 text-[#31757A]" />
                  All Bills
                </Card.Title>
                <Card.Description className="text-sm mt-1">
                  {pagination.totalBills > 0 
                    ? `Showing ${((pagination.currentPage - 1) * pagination.limit) + 1} to ${Math.min(pagination.currentPage * pagination.limit, pagination.totalBills)} of ${pagination.totalBills} bills`
                    : 'No bills found'
                  }
                </Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#31757A]"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <DocumentTextIcon className="h-6 w-6 text-[#31757A]" />
                  </div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading bills...</p>
              </div>
            ) : bills.length === 0 ? (
              <div className="text-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-linear-to-br from-[#E3F9F9] to-white rounded-full">
                    <DocumentTextIcon className="w-16 h-16 text-[#31757A]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-700 mb-2">No bills found</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchQuery || Object.values(filters).some(Boolean)
                        ? 'Try adjusting your search or filters'
                        : 'Start by creating your first bill'}
                    </p>
                    <Button
                      variant="primary"
                      leftIcon={<PlusIcon className="h-5 w-5" />}
                      onClick={() => navigate('/admin/quick-pay')}
                      className="bg-linear-to-r from-[#31757A] to-[#41A4A7] shadow-lg hover:shadow-xl"
                    >
                      Create First Bill
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Receipt No</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Member ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Member Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Account Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {bills.map((bill, index) => (
                      <motion.tr
                        key={bill._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-linear-to-r hover:from-[#E3F9F9]/20 hover:to-transparent transition-all duration-200 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#31757A] group-hover:text-[#41A4A7] transition-colors">
                            {bill.receiptNo || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">
                              {new Date(bill.createdAt || bill.date || bill.Date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(bill.createdAt || bill.date || bill.Date).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            {bill.mahalId || bill.Mahal_Id || bill.mahal_ID || <span className="text-gray-400">N/A</span>}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0">
                              <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center text-white font-bold shadow-md">
                                {bill.memberId?.Fname?.charAt(0).toUpperCase() || bill.address?.charAt(0).toUpperCase() || '?'}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {bill.memberId?.Fname || bill.address?.substring(0, 20) || <span className="text-gray-400">N/A</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <Badge
                            className={cn(
                              "font-semibold border",
                              getAccountTypeColor(bill.accountType || bill.category)
                            )}
                            size="sm"
                          >
                            {bill.accountType || bill.category || 'N/A'}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-base font-bold text-green-600">
                            {formatCurrency(bill.amount || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <Badge
                            className={cn(
                              "font-semibold border",
                              getPaymentMethodColor(bill.paymentMethod || 'Cash')
                            )}
                            size="sm"
                          >
                            {bill.paymentMethod || 'Cash'}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintReceipt(bill._id)}
                            className="text-[#31757A] hover:bg-[#E3F9F9] hover:text-[#41A4A7] transition-all"
                            title="Print Receipt"
                          >
                            <PrinterIcon className="w-5 h-5" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <Card.Footer className="bg-linear-to-r from-gray-50 to-[#E3F9F9]/30 border-t-2 border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <p className="text-sm text-gray-600 font-medium">
                  Showing <span className="font-bold text-[#31757A]">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-bold text-[#31757A]">{Math.min(pagination.currentPage * pagination.limit, pagination.totalBills)}</span> of{' '}
                  <span className="font-bold text-[#31757A]">{pagination.totalBills}</span> bills
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm font-bold text-gray-700 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card.Footer>
          )}
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default BillsPage;
