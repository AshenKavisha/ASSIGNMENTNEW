import React, { useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const PaymentMethodSelection = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bankSectionRef = useRef(null);

  const assignmentId = searchParams.get('id') || '123';
  const orderId = `ORD-${assignmentId}-${Math.floor(Math.random() * 1000)}`;
  
  // Mock Data
  const paymentInfo = {
    amount: 2500.00,
    currency: "Rs.",
    title: "Java OOP Assignment",
    subject: "Object Oriented Programming",
    type: "IT",
    adminWhatsApp: "94788769570"
  };

  const bankDetails = {
    name: "Ashen Kaveesha Lakshan Fernando",
    account: "269200280046594",
    branch: "Badulla"
  };

  const selectMethod = (method) => {
    setSelectedMethod(method);
    if (method === 'bank') {
      setTimeout(() => {
        bankSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const copyToClipboard = (text, e) => {
    navigator.clipboard.writeText(text);
    const btn = e.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
    btn.style.background = '#28a745';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '#667eea';
    }, 2000);
  };

  const sendToWhatsApp = () => {
    const message = `🎓 *Payment Confirmation - Assignment Service*%0A%0A` +
      `💎 *Order ID:* ${orderId}%0A` +
      `💰 *Amount:* ${paymentInfo.currency}${paymentInfo.amount}%0A` +
      `📝 *Assignment ID:* ${assignmentId}%0A%0A` +
      `✅ I have completed the bank transfer.%0A` +
      `📎 Payment slip attached.%0A%0A` +
      `Please verify and confirm my payment.`;

    const whatsappUrl = `https://wa.me/${paymentInfo.adminWhatsApp}?text=${message}`;
    
    alert('📱 WhatsApp will open now.\n\n⚠️ IMPORTANT: Please attach your payment slip image/screenshot in WhatsApp before sending the message!');
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      if (window.confirm('Have you sent the payment slip via WhatsApp?')) {
        navigate('/dashboard?success=Payment confirmation sent!');
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] py-10 px-4 font-sans">
      <div className="max-w-[900px] mx-auto">
        
        {/* Page Header */}
        <div className="text-center text-white mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <i className="bi bi-cash-coin"></i> Select Payment Method
          </h1>
          <p className="text-lg opacity-90">Choose how you'd like to complete your payment</p>
        </div>

        {/* Assignment Summary */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl animate-slideUp">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
            <i className="bi bi-file-text text-[#667eea]"></i> Assignment Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <p><strong>Title:</strong> {paymentInfo.title}</p>
            <p><strong>Subject:</strong> {paymentInfo.subject}</p>
            <p><strong>Type:</strong> <span className={`badge ${paymentInfo.type === 'IT' ? 'bg-primary' : 'bg-success'}`}>{paymentInfo.type}</span></p>
            <p><strong>Order ID:</strong> <span className="font-mono font-bold text-gray-800">{orderId}</span></p>
          </div>
          <div className="mt-6 bg-blue-50/50 rounded-xl p-6 text-center border-2 border-blue-50">
            <small className="text-gray-400 block mb-1 font-bold uppercase tracking-wider">Total Amount</small>
            <h2 className="text-4xl font-black text-[#667eea] m-0">{paymentInfo.currency} {paymentInfo.amount.toFixed(2)}</h2>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* PayHere Option */}
          <div 
            onClick={() => selectMethod('payhere')}
            className={`bg-white rounded-2xl p-8 shadow-xl cursor-pointer transition-all duration-300 border-4 animate-slideUp-delay-1 ${selectedMethod === 'payhere' ? 'border-[#28a745] bg-green-50/20' : 'border-transparent hover:-translate-y-2 hover:border-[#667eea]'}`}
          >
            <div className="text-center mb-6">
              <i className="bi bi-credit-card-2-front text-5xl text-[#667eea] mb-3 block"></i>
              <h3 className="text-2xl font-bold text-gray-800">PayHere Gateway</h3>
              <p className="text-gray-400">Fast & secure online payment</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-[#28a745]"></i> Instant confirmation</li>
              <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-[#28a745]"></i> All cards accepted</li>
              <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-[#28a745]"></i> Secure encrypted</li>
            </ul>
          </div>

          {/* Bank Option */}
          <div 
            onClick={() => selectMethod('bank')}
            className={`bg-white rounded-2xl p-8 shadow-xl cursor-pointer transition-all duration-300 border-4 animate-slideUp-delay-1 ${selectedMethod === 'bank' ? 'border-[#28a745] bg-green-50/20' : 'border-transparent hover:-translate-y-2 hover:border-[#667eea]'}`}
          >
            <div className="text-center mb-6">
              <i className="bi bi-bank text-5xl text-[#667eea] mb-3 block"></i>
              <h3 className="text-2xl font-bold text-gray-800">Bank Transfer</h3>
              <p className="text-gray-400">Direct bank deposit/transfer</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-[#28a745]"></i> No transaction fees</li>
              <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-[#28a745]"></i> Any bank supported</li>
              <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-[#28a745]"></i> Verified in 24 hours</li>
            </ul>
          </div>

        </div>

        {/* Conditional Sections */}
        {selectedMethod === 'payhere' && (
          <div className="animate-fadeIn">
            <Link to={`/payment/checkout?id=${assignmentId}`} className="w-full block text-center bg-gradient-to-r from-[#28a745] to-[#20c997] text-white py-4 rounded-xl text-xl font-bold shadow-lg hover:-translate-y-1 transition-all no-underline">
              <i className="bi bi-shield-check mr-2"></i> Proceed to PayHere Payment
            </Link>
          </div>
        )}

        {selectedMethod === 'bank' && (
          <div ref={bankSectionRef} className="bg-white rounded-2xl p-8 shadow-2xl animate-slideDown">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="bi bi-bank text-[#667eea]"></i> Bank Transfer Instructions
            </h4>

            <div className="bg-[#e7f3ff] border-l-4 border-[#0d6efd] p-4 rounded-lg mb-8 text-[#0d6efd] font-bold text-sm">
              Please transfer the exact amount to the following bank account:
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold text-gray-500 uppercase text-xs">Account Name:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{bankDetails.name}</span>
                  <button onClick={(e) => copyToClipboard(bankDetails.name, e)} className="bg-[#667eea] text-white px-3 py-1 rounded text-xs border-none cursor-pointer">Copy</button>
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold text-gray-500 uppercase text-xs">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-800 text-lg">{bankDetails.account}</span>
                  <button onClick={(e) => copyToClipboard(bankDetails.account, e)} className="bg-[#667eea] text-white px-3 py-1 rounded text-xs border-none cursor-pointer">Copy</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-500 uppercase text-xs">Branch:</span>
                <span className="font-bold text-gray-800">{bankDetails.branch}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#d4edda] text-[#155724] p-4 rounded-lg flex items-start gap-3">
                <i className="bi bi-whatsapp text-xl"></i>
                <p className="m-0 text-sm"><strong>Next Step:</strong> Click the button below to send your payment slip via WhatsApp for manual verification.</p>
              </div>
              <button onClick={sendToWhatsApp} className="w-full bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
                <i className="bi bi-whatsapp text-2xl"></i> Send Payment Confirmation
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/dashboard" className="text-white font-bold no-underline hover:opacity-80 transition-opacity">
            <i className="bi bi-arrow-left"></i> Return to Dashboard
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-slideUp-delay-1 { animation: slideUp 0.6s ease-out 0.2s both; }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default PaymentMethodSelection;