import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('id') || '123';

  // Mock Data - පස්සේ කාලෙක Backend එකෙන් ගන්න පුළුවන්
  const paymentData = {
    assignment: {
      title: "Java OOP Assignment",
      subject: "Object Oriented Programming",
      type: "IT"
    },
    orderId: `ORD-${assignmentId}-${Math.floor(Math.random() * 1000)}`,
    amount: 2500.00,
    currency: { symbol: "Rs.", displayName: "Sri Lankan Rupee", code: "LKR" },
    user: {
      fullName: "Ashen Kaveesha",
      email: "ashen@example.com",
      phone: "0757300842"
    },
    payhere: {
      merchantId: "121XXXX", // ඔයාගේ PayHere Merchant ID එක
      apiUrl: "https://sandbox.payhere.lk/pay/checkout", // Testing වලට sandbox පාවිච්චි කරන්න
      hash: "XXXXX", // Backend එකෙන් generate කරලා එන hash එක
      returnUrl: "http://localhost:5173/payment/result?status=success",
      cancelUrl: "http://localhost:5173/payment/result?status=cancel",
      notifyUrl: "http://your-backend-api.com/notify"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      
      <div className="max-w-[600px] w-full animate-slideUp">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border-none">
          
          {/* Header */}
          <div className="bg-gradient-to-tr from-[#667eea] to-[#764ba2] text-white p-8 text-center">
            <h1 className="m-0 text-[1.8rem] font-bold flex items-center justify-center gap-3">
              <i className="bi bi-credit-card-2-front"></i> Complete Your Payment
            </h1>
            <p className="mt-2 opacity-90">Secure payment powered by PayHere</p>
          </div>

          <div className="p-8">
            {/* Info Banner */}
            <div className="bg-[#e7f3ff] border-l-4 border-[#0d6efd] p-4 rounded-lg mb-6 flex items-start gap-3">
              <i className="bi bi-info-circle-fill text-[#0d6efd] text-lg"></i>
              <span className="text-[#0d6efd] font-medium text-sm">
                <strong>Assignment Approved!</strong> Complete payment to start processing your assignment.
              </span>
            </div>

            {/* Assignment Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <h5 className="mb-4 text-gray-800 font-bold flex items-center gap-2 border-b border-gray-200 pb-2">
                <i className="bi bi-file-text text-[#667eea]"></i> Assignment Details
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Title:</span>
                  <span className="text-gray-900 font-bold">{paymentData.assignment.title}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Subject:</span>
                  <span className="text-gray-900 font-bold">{paymentData.assignment.subject}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Type:</span>
                  <span className={`px-3 py-0.5 rounded-full text-white text-[10px] font-bold ${paymentData.assignment.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {paymentData.assignment.type}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="text-gray-900 font-bold font-mono">{paymentData.orderId}</span>
                </div>
              </div>
            </div>

            {/* Amount Section */}
            <div className="bg-blue-50/30 rounded-xl p-6 mb-8 text-center border-2 border-blue-50">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Amount</p>
              <h2 className="text-[2.5rem] font-black text-[#667eea] m-0">
                <span className="text-xl align-top mr-1 font-bold">{paymentData.currency.symbol}</span>
                {paymentData.amount.toFixed(2)}
              </h2>
              <small className="text-gray-400 font-medium">{paymentData.currency.displayName}</small>
            </div>

            {/* PayHere Hidden Form */}
            <form method="post" action={paymentData.payhere.apiUrl}>
              <input type="hidden" name="merchant_id" value={paymentData.payhere.merchantId} />
              <input type="hidden" name="return_url" value={paymentData.payhere.returnUrl} />
              <input type="hidden" name="cancel_url" value={paymentData.payhere.cancelUrl} />
              <input type="hidden" name="notify_url" value={paymentData.payhere.notifyUrl} />
              <input type="hidden" name="order_id" value={paymentData.orderId} />
              <input type="hidden" name="items" value={paymentData.assignment.title} />
              <input type="hidden" name="currency" value={paymentData.currency.code} />
              <input type="hidden" name="amount" value={paymentData.amount} />
              <input type="hidden" name="first_name" value={paymentData.user.fullName} />
              <input type="hidden" name="last_name" value="" />
              <input type="hidden" name="email" value={paymentData.user.email} />
              <input type="hidden" name="phone" value={paymentData.user.phone} />
              <input type="hidden" name="address" value="Sri Lanka" />
              <input type="hidden" name="city" value="Colombo" />
              <input type="hidden" name="country" value="Sri Lanka" />
              <input type="hidden" name="hash" value={paymentData.payhere.hash} />

              <button type="submit" className="w-full bg-gradient-to-r from-[#28a745] to-[#20c997] text-white py-4 rounded-xl text-lg font-bold shadow-[0_4px_15px_rgba(40,167,69,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(40,167,69,0.4)] transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
                <i className="bi bi-shield-check text-xl"></i> Proceed to Secure Payment
              </button>
            </form>

            {/* Security Badges */}
            <div className="text-center mt-8 space-y-4">
              <div className="flex flex-col items-center">
                <i className="bi bi-shield-fill-check text-[2rem] text-[#28a745] mb-1"></i>
                <p className="text-xs text-gray-500 font-bold m-0 uppercase tracking-tighter">Secure Payment</p>
                <span className="text-[10px] text-gray-400">Your payment information is encrypted and secure</span>
              </div>
              <div className="opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <small className="text-gray-400 font-medium block mb-1">Powered by</small>
                <img src="https://www.payhere.lk/downloads/images/payhere_logo_dark.png" alt="PayHere" className="h-6 mx-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/dashboard" className="text-white text-sm font-bold no-underline flex items-center justify-center gap-2 hover:translate-x-[-4px] transition-transform">
            <i className="bi bi-arrow-left"></i> Return to Dashboard
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Checkout;