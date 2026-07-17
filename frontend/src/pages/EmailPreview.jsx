import React from 'react';
import { Link } from 'react-router-dom';

const EmailPreview = () => {
  // Email එකට යවන Data ටික Mock කරලා තියෙන්නේ
  const emailData = {
    studentName: "Ashen Kaveesha",
    assignmentTitle: "Java OOP Assignment",
    assignmentSubject: "Object Oriented Programming",
    assignmentType: "IT",
    deliveryDate: "Mar 18, 2026",
    price: "45.00",
    dashboardLink: "/user/dashboard"
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 font-sans flex flex-col items-center">
      
      {/* Top Bar (Preview Controls - මේක Email එකේ කෑල්ලක් නෙවෙයි, Preview එකට විතරයි) */}
      <div className="mb-6 w-full max-w-[600px] flex justify-between items-center animate-fadeInDown">
        <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-bold transition-colors">
          <i className="bi bi-arrow-left"></i> Go Back
        </button>
        <span className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-blue-500 shadow-sm border border-gray-300 flex items-center gap-2">
          <i className="bi bi-envelope-paper"></i> Email Template Preview
        </span>
      </div>

      {/* Actual Email Container */}
      <div className="max-w-[600px] w-full bg-white shadow-2xl rounded-xl overflow-hidden animate-fadeInUp">
        
        {/* Email Header */}
        <div className="bg-[#4CAF50] text-white p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold m-0 drop-shadow-md">
            🎉 Your Assignment Solution is Ready!
          </h1>
        </div>

        {/* Email Content */}
        <div className="bg-[#f9f9f9] p-8">
          <p className="text-gray-800 mb-5 text-lg font-medium">Dear {emailData.studentName},</p>

          <p className="text-gray-700 mb-6 leading-relaxed text-base">
            We're pleased to inform you that your assignment solution for <strong className="text-gray-900">{emailData.assignmentTitle}</strong> is now complete!
          </p>

          {/* Details Box */}
          <div className="bg-white p-6 border-l-4 border-[#4CAF50] my-8 shadow-sm rounded-r-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 mt-0 border-b pb-2">Assignment Details:</h3>
            <ul className="space-y-3 text-gray-700 m-0 pl-2 list-none">
              <li className="flex gap-2"><strong className="w-32 text-gray-900">Title:</strong> {emailData.assignmentTitle}</li>
              <li className="flex gap-2"><strong className="w-32 text-gray-900">Subject:</strong> {emailData.assignmentSubject}</li>
              <li className="flex gap-2"><strong className="w-32 text-gray-900">Type:</strong> {emailData.assignmentType}</li>
              <li className="flex gap-2"><strong className="w-32 text-gray-900">Delivery Date:</strong> {emailData.deliveryDate}</li>
              {emailData.price && (
                <li className="flex gap-2 text-green-700"><strong className="w-32">Final Price:</strong> ${emailData.price}</li>
              )}
            </ul>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3 flex items-center gap-2">
            📎 Attached Files:
          </h3>
          <p className="text-gray-700 mb-8">
            Your solution files are attached to this email. Please download them for your review.
          </p>

          {/* Action Button */}
          <div className="my-10 text-center">
            <Link 
              to={emailData.dashboardLink} 
              className="inline-block bg-[#4CAF50] text-white px-8 py-4 rounded-lg font-bold no-underline hover:bg-green-600 hover:shadow-lg hover:-translate-y-1 transition-all shadow-md text-lg"
            >
              Go to Your Dashboard
            </Link>
          </div>

          {/* Important Notes */}
          <div className="bg-[#fff3cd] p-6 rounded-lg my-8 border border-[#ffeeba]">
            <h4 className="text-[#856404] mt-0 mb-3 font-bold text-lg flex items-center gap-2">
              📋 Important Notes:
            </h4>
            <ul className="text-[#856404] m-0 pl-6 space-y-2 list-disc">
              <li>Please review all files carefully.</li>
              <li>If you need any revisions, please submit a revision request through your dashboard.</li>
              <li>For any questions, contact our support team.</li>
            </ul>
          </div>

          <p className="text-gray-700 mb-0 text-base font-medium">
            We hope you're satisfied with the solution. Thank you for choosing our service!
          </p>
        </div>

        {/* Email Footer */}
        <div className="p-8 border-t border-gray-200 bg-white">
          <p className="text-gray-700 mb-6 text-base">
            Best regards,<br />
            <strong className="text-gray-900 text-lg">Assignment Service Team</strong>
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-xs text-gray-500 leading-relaxed m-0 text-center">
              This is an automated message. Please do not reply to this email.<br />
              If you have any questions, please contact <a href="mailto:support@assignmentservice.com" className="text-blue-500 hover:underline">support@assignmentservice.com</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInDown { animation: fadeInDown 0.5s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default EmailPreview;