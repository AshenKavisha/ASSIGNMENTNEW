import React from 'react';

const ReturnPolicy = () => {
  return (
    // Body background eka saha font eka
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans text-base leading-relaxed">
      {/* Container eka */}
      <div className="max-w-[900px] mx-auto">
        
        {/* Card eka */}
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden mb-8">
          
          {/* Card Header eka */}
          <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 text-center">
            <h1 className="m-0 text-3xl md:text-[2rem] font-bold flex items-center justify-center gap-2">
              <i className="bi bi-arrow-return-left"></i> Return & Refund Policy
            </h1>
            <p className="mt-2 opacity-90">Last Updated: January 16, 2026</p>
          </div>

          {/* Card Body eka */}
          <div className="p-8 md:p-12 text-[#555]">
            
            {/* Highlight Box */}
            <div className="bg-[#e7f3ff] border-l-4 border-[#3498db] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-info-circle mr-1"></i> Important:
              </strong>{' '}
              This policy outlines our return and refund procedures for assignment services. Please read carefully before making a payment.
            </div>

            <h2 className="text-[#2c3e50] mt-0 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              1. Refund Eligibility
            </h2>
            <p className="mb-4">We offer refunds under the following circumstances:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Service Not Delivered:</strong> If we fail to deliver your completed assignment by the agreed deadline without prior notice or valid reason.</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Quality Issues:</strong> If the delivered assignment does not meet the specified requirements outlined in your initial submission.</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Duplicate Payment:</strong> If you were charged multiple times for the same assignment due to a technical error.</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Service Cancellation:</strong> If you cancel your assignment request before work has commenced (within 24 hours of payment).</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              2. Non-Refundable Situations
            </h2>
            <p className="mb-4">Refunds will <strong className="text-[#2c3e50]">NOT</strong> be provided in the following cases:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Change of mind after work has started</li>
              <li className="mb-2">Assignment already submitted or partially completed</li>
              <li className="mb-2">Failure to provide complete or accurate requirements</li>
              <li className="mb-2">Request for services beyond the original scope</li>
              <li className="mb-2">Academic institution rejection (due to factors beyond our control)</li>
              <li className="mb-2">After final delivery and approval of the assignment</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              3. Refund Request Process
            </h2>
            <p className="mb-4">To request a refund, please follow these steps:</p>
            <ol className="mb-4 pl-8 list-decimal">
              <li className="mb-2"><strong className="text-[#2c3e50]">Contact Us:</strong> Email us at <strong className="text-[#2c3e50]">support@assignmentservice.com</strong> within 7 days of payment or delivery</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Provide Details:</strong> Include your order ID, payment details, and reason for refund request</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Review Period:</strong> We will review your request within 2-3 business days</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Decision:</strong> You will be notified of the approval or rejection of your refund request</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Processing:</strong> If approved, refunds will be processed within 5-10 business days</li>
            </ol>

            {/* Warning Box */}
            <div className="bg-[#fff3cd] border-l-4 border-[#f39c12] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-exclamation-triangle mr-1"></i> Note:
              </strong>{' '}
              Refund requests must be made within 7 days of the payment or delivery date. Requests after this period will not be considered.
            </div>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              4. Partial Refunds
            </h2>
            <p className="mb-4">In certain situations, partial refunds may be granted:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">If the assignment is partially completed and meets some but not all requirements</li>
              <li className="mb-2">If minor revisions are needed but the overall work is satisfactory</li>
              <li className="mb-2">If there are minor delays that did not significantly impact your submission</li>
            </ul>
            <p className="mb-4">The refund amount will be determined based on the work completed and delivered.</p>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              5. Refund Method
            </h2>
            <p className="mb-4">Refunds will be processed using the same payment method used for the original transaction:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Card Payments:</strong> Refunded to the original card (5-10 business days)</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Bank Transfers:</strong> Refunded to the provided bank account (3-7 business days)</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">E-Wallets:</strong> Refunded to the same wallet account (2-5 business days)</li>
            </ul>

            {/* Success Box */}
            <div className="bg-[#d4edda] border-l-4 border-[#27ae60] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-shield-check mr-1"></i> Our Guarantee:
              </strong>{' '}
              We are committed to delivering quality work. If you're not satisfied with the delivered assignment, we offer free revisions as per our revision policy before proceeding with refund requests.
            </div>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              6. Revision Policy (Alternative to Refund)
            </h2>
            <p className="mb-4">Before requesting a refund, we encourage you to request revisions:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Free Revisions:</strong> Up to 2 free revisions within 7 days of delivery</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Scope:</strong> Revisions must be within the original assignment requirements</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Turnaround:</strong> Revisions completed within 2-3 business days</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              7. Cancellation Policy
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">Before Work Starts:</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Full refund if cancelled within 24 hours of payment</li>
              <li className="mb-2">No questions asked</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">After Work Starts:</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">50% refund if less than 25% work completed</li>
              <li className="mb-2">25% refund if 25-50% work completed</li>
              <li className="mb-2">No refund if more than 50% work completed</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              8. Dispute Resolution
            </h2>
            <p className="mb-4">If you disagree with our refund decision:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">You may submit an appeal with additional supporting documentation</li>
              <li className="mb-2">Appeals will be reviewed by our senior management team</li>
              <li className="mb-2">Final decision will be communicated within 5 business days</li>
              <li className="mb-2">Management decision is final</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              9. Payment Gateway Refunds
            </h2>
            <p className="mb-4">Please note:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Processing fees charged by PayHere (3.30%) are non-refundable</li>
              <li className="mb-2">Bank charges or currency conversion fees are non-refundable</li>
              <li className="mb-2">Only the net amount paid for services will be refunded</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              10. Policy Updates
            </h2>
            <p className="mb-4">We reserve the right to update this policy at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the updated policy.</p>

            {/* Contact Info Box */}
            <div className="bg-[#f8f9fa] p-6 rounded-[10px] mt-8">
              <h2 className="text-[#2c3e50] text-2xl font-bold mb-4 flex items-center gap-2">
                <i className="bi bi-envelope"></i> Contact Us
              </h2>
              <p className="mb-4">For refund requests or questions about this policy, please contact us:</p>
              <ul className="mb-4 pl-0 list-none">
                <li className="mb-2"><i className="bi bi-envelope-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Email:</strong> assignmentservice.net@gmail.com</li>
                <li className="mb-2"><i className="bi bi-telephone-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Phone:</strong> +94 788 769 570</li>
                <li className="mb-2"><i className="bi bi-clock-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (Sri Lanka Time)</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;