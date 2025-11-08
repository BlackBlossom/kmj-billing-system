import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PrinterIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getReceiptData } from '../../services/billService';
import logo from '../../assets/Images/logos.png';

const ReceiptPage = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const response = await getReceiptData(id);
      setReceipt(response.data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      toast.error('Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Receipt Not Found</h2>
          <p className="text-gray-600">The receipt you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden fixed top-6 right-6 z-50">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#31757A] text-white rounded-lg hover:bg-[#41A4A7] transition-colors font-medium text-sm"
        >
          <PrinterIcon className="w-5 h-5" />
          Print Receipt
        </button>
      </div>

      {/* Receipt Container */}
      <div className="min-h-screen bg-gray-100 print:bg-white py-8 print:py-0 px-4">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none" style={{ minHeight: '297mm' }}>
          
          {/* Header - Simple and Professional */}
          <div className="border-b-4 border-double border-gray-800 px-8 py-6">
            <div className="text-center">
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <img
                  src={logo}
                  alt="Kalloor Muslim JamaAth"
                  className="h-18 w-auto object-contain"
                />
              </div>
              
              {/* <h1 className="text-3xl font-bold text-gray-900 mb-1 uppercase tracking-wide">
                {receipt.organizationName || 'Kalloor Muslim JamaAth'}
              </h1> */}
              <p className="text-sm text-gray-600 font-medium">
                {receipt.organizationAddress || 'Kalloor, Kerala, India'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Registered Jamaath Organization
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-block border-2 border-gray-800 px-8 py-2">
                <h2 className="text-xl font-bold text-gray-900 tracking-wider">
                  PAYMENT RECEIPT
                </h2>
              </div>
            </div>
          </div>

          {/* Receipt Number and Date - Simple Grid */}
          <div className="px-8 py-4 border-b border-gray-300 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Receipt No.</p>
                <p className="text-base font-bold text-gray-900">
                  {receipt.receiptNo || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Date</p>
                <p className="text-base font-bold text-gray-900">
                  {receipt.date || 'N/A'}
                </p>
                {receipt.time && (
                  <p className="text-xs text-gray-600 mt-0.5">{receipt.time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-6">
            
            {/* Member Information - Table Style */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 border-b border-gray-400 pb-1">
                Received From
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-semibold w-1/3">Mahal ID:</td>
                    <td className="py-2 text-gray-900 font-medium">
                      {receipt.mahalId || 'N/A'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-semibold">Name:</td>
                    <td className="py-2 text-gray-900 font-medium">
                      {receipt.memberName || 'N/A'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-semibold">Address:</td>
                    <td className="py-2 text-gray-900">
                      {receipt.memberAddress || 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Details - Table Style */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 border-b border-gray-400 pb-1">
                Payment Information
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-semibold w-1/3">Account Type:</td>
                    <td className="py-2 text-gray-900 font-medium">
                      {receipt.accountType || receipt.category || 'N/A'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-semibold">Payment Method:</td>
                    <td className="py-2 text-gray-900 font-medium">
                      {receipt.paymentMethod || 'Cash'}
                    </td>
                  </tr>
                  {receipt.financialYear && (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600 font-semibold">Financial Year:</td>
                      <td className="py-2 text-gray-900 font-medium">{receipt.financialYear}</td>
                    </tr>
                  )}
                  {receipt.notes && (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600 font-semibold align-top">Notes:</td>
                      <td className="py-2 text-gray-900">{receipt.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Amount Section - Clean Box */}
            <div className="mb-8 border-2 border-gray-800 p-6">
              <div className="mb-4">
                <div className="flex justify-between items-baseline border-b border-gray-400 pb-2">
                  <span className="text-base font-bold text-gray-900 uppercase">Amount Paid:</span>
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(receipt.amount || 0)}
                  </span>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Amount in Words:</p>
                <p className="text-base font-semibold text-gray-900 capitalize leading-relaxed">
                  {receipt.amountInWords || 'N/A'}
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-t-2 border-gray-800 pt-8 mt-12">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-16">Received with thanks</p>
                  <div className="border-t border-gray-800 pt-2 inline-block min-w-[200px]">
                    <p className="text-xs font-semibold text-gray-900">Receiver's Signature</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-16">
                    For {receipt.organizationName || 'Kalloor Muslim JamaAth'}
                  </p>
                  <div className="border-t border-gray-800 pt-2 inline-block min-w-[200px]">
                    <p className="text-xs font-semibold text-gray-900">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Information */}
            <div className="mt-12 pt-4 border-t border-gray-300">
              <div className="text-center space-y-1">
                <p className="text-xs text-gray-500">
                  This is a computer-generated receipt and is valid without signature.
                </p>
                <p className="text-xs text-gray-500">
                  Contact: info@kmj.org | +91 XXXXX XXXXX
                </p>
                <p className="text-xs text-gray-400 font-mono mt-2">
                  {receipt.receiptNo} | {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4;
            margin: 15mm;
          }
          
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:bg-white {
            background: white !important;
          }
          
          .print\\:bg-gray-100 {
            background: #f3f4f6 !important;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:text-gray-700 {
            color: #374151 !important;
          }
          
          .print\\:text-gray-800 {
            color: #1f2937 !important;
          }
          
          .print\\:border-black {
            border-color: black !important;
          }
          
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:mt-4 {
            margin-top: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default ReceiptPage;
