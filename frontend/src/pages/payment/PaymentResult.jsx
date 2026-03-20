import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  // URL එකෙන් status එක ගන්නවා (උදා: /payment/result?status=success)
  const status = searchParams.get('status') || 'success'; 

  // Mock Data - පස්සේ කාලෙක URL params වලින්ම මේවා ගන්නත් පුළුවන්
  const paymentDetails = {
    orderId: "ORD-123-456",
    formattedAmount: "Rs. 2500.00",
    assignmentTitle: "Java OOP Assignment",
    date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="animate-fadeIn">
            <div className="p-12 pb-4 text-[#28a745]">
              <i className="bi bi-check-circle-fill text-[5rem] animate-scaleIn inline-block"></i>
            </div>
            <div className="p-8 pt-0">
              <h1 className="text-3xl font-bold text-[#28a745] mb-4">Payment Successful!</h1>
              <p className="text-gray-500 text-lg mb-8">Your payment has been processed successfully.</p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                <h6 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="bi bi-receipt"></i> Payment Details
                </h6>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-bold text-gray-800">{paymentDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-gray-800">{paymentDetails.formattedAmount}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Assignment:</span>
                    <span className="font-bold text-gray-800">{paymentDetails.assignmentTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-bold text-gray-800">{paymentDetails.date}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#e7f3ff] border-l-4 border-[#0d6efd] p-4 rounded-lg text-left mb-8">
                <p className="text-[#0d6efd] font-bold m-0 flex items-center gap-2 text-sm">
                  <i className="bi bi-info-circle-fill"></i> What's Next?
                </p>
                <p className="text-[#0d6efd]/80 text-xs mt-2 m-0 leading-relaxed">
                  You will receive an email confirmation shortly. Admin will start working on your assignment now.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-xl font-bold no-underline hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
                <Link to="/assignments/my-assignments" className="flex-1 border-2 border-[#667eea] text-[#667eea] py-3 rounded-xl font-bold no-underline hover:bg-[#667eea] hover:text-white transition-all flex items-center justify-center gap-2">
                  <i className="bi bi-eye"></i> View Assignment
                </Link>
              </div>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="animate-fadeIn">
            <div className="p-12 pb-4 text-[#ffc107]">
              <i className="bi bi-hourglass-split text-[5rem] animate-scaleIn inline-block"></i>
            </div>
            <div className="p-8 pt-0">
              <h1 className="text-3xl font-bold text-[#ffc107] mb-4">Payment Processing</h1>
              <p className="text-gray-500 text-lg mb-8">Your payment is being processed by the gateway.</p>
              
              <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-5 rounded-lg text-left mb-8">
                <p className="text-[#856404] font-bold m-0 flex items-center gap-2">
                  <i className="bi bi-info-circle-fill"></i> Please Wait
                </p>
                <p className="text-[#856404]/80 text-sm mt-2 m-0">
                  Your payment is being verified. This might take a few minutes. Check your dashboard later.
                </p>
              </div>

              <Link to="/dashboard" className="w-full inline-block bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-xl font-bold no-underline hover:shadow-lg transition-all">
                <i className="bi bi-speedometer2 mr-2"></i> Go to Dashboard
              </Link>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="animate-fadeIn">
            <div className="p-12 pb-4 text-[#dc3545]">
              <i className="bi bi-x-circle-fill text-[5rem] animate-scaleIn inline-block"></i>
            </div>
            <div className="p-8 pt-0">
              <h1 className="text-3xl font-bold text-[#dc3545] mb-4">Payment Failed</h1>
              <p className="text-gray-500 text-lg mb-8">Oops! Something went wrong during the transaction.</p>

              <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-5 rounded-lg text-left mb-8 text-[#721c24]">
                <p className="font-bold m-0 flex items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i> What Can You Do?
                </p>
                <ul className="text-sm mt-2 mb-0 pl-5 space-y-1">
                  <li>Check your card details and try again</li>
                  <li>Ensure you have sufficient balance</li>
                  <li>Contact your bank if the amount was deducted</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="flex-1 border-2 border-gray-300 text-gray-500 py-3 rounded-xl font-bold no-underline hover:bg-gray-100 transition-all">
                  Dashboard
                </Link>
                <Link to="/contact" className="flex-1 bg-[#dc3545] text-white py-3 rounded-xl font-bold no-underline hover:bg-[#c82333] transition-all flex items-center justify-center gap-2">
                  <i className="bi bi-headset"></i> Contact Support
                </Link>
              </div>
            </div>
          </div>
        );

      case 'cancel':
        return (
          <div className="animate-fadeIn">
            <div className="p-12 pb-4 text-[#6c757d]">
              <i className="bi bi-x-circle text-[5rem] animate-scaleIn inline-block"></i>
            </div>
            <div className="p-8 pt-0">
              <h1 className="text-3xl font-bold text-[#6c757d] mb-4">Payment Cancelled</h1>
              <p className="text-gray-500 text-lg mb-8">The transaction was cancelled by you.</p>

              <div className="bg-gray-100 border-l-4 border-gray-400 p-5 rounded-lg text-left mb-8 text-gray-600 font-medium">
                No charges were applied to your account. You can complete the payment whenever you're ready.
              </div>

              <Link to="/dashboard" className="w-full inline-block bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-xl font-bold no-underline hover:shadow-lg transition-all">
                <i className="bi bi-speedometer2 mr-2"></i> Go to Dashboard
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans text-center">
      <div className="max-w-[600px] w-full animate-slideUp">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border-none">
          {renderContent()}
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <Link to="/" className="text-white font-bold no-underline hover:opacity-80 transition-opacity flex items-center gap-2">
            <i className="bi bi-house"></i> Home
          </Link>
          <Link to="/contact" className="text-white font-bold no-underline hover:opacity-80 transition-opacity flex items-center gap-2">
            <i className="bi bi-envelope"></i> Support
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PaymentResult;