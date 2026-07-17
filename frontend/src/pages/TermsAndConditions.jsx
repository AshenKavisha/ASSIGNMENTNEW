import React from 'react';

const TermsAndConditions = () => {
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
              <i className="bi bi-file-text"></i> Terms & Conditions
            </h1>
            <p className="mt-2 opacity-90">Last Updated: January 16, 2026</p>
          </div>

          {/* Card Body eka */}
          <div className="p-8 md:p-12 text-[#555]">
            
            {/* Danger Box */}
            <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-exclamation-triangle-fill mr-1"></i> Important Notice:
              </strong>{' '}
              By using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
            </div>

            <h2 className="text-[#2c3e50] mt-6 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">By accessing and using Assignment Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              2. Service Description
            </h2>
            <p className="mb-4">Assignment Service provides academic assistance services including:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">IT assignment completion and guidance</li>
              <li className="mb-2">Quantity Surveying (QS) assignment assistance</li>
              <li className="mb-2">Academic writing and research support</li>
              <li className="mb-2">Project consultation and guidance</li>
            </ul>

            {/* Warning Box */}
            <div className="bg-[#fff3cd] border-l-4 border-[#f39c12] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-info-circle mr-1"></i> Academic Integrity:
              </strong>{' '}
              Our services are intended to assist and guide students in their learning process. Students are responsible for ensuring their use of our services complies with their institution's academic integrity policies.
            </div>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              3. User Eligibility
            </h2>
            <p className="mb-4">To use our services, you must:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Be at least 18 years of age</li>
              <li className="mb-2">Be enrolled in an undergraduate program</li>
              <li className="mb-2">Provide accurate and complete registration information</li>
              <li className="mb-2">Have the legal capacity to enter into binding contracts</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              4. User Account
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">4.1 Registration</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">You must create an account to use our services</li>
              <li className="mb-2">You are responsible for maintaining account confidentiality</li>
              <li className="mb-2">You must provide accurate, current, and complete information</li>
              <li className="mb-2">One person may not maintain multiple accounts</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">4.2 Account Security</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">You are responsible for all activities under your account</li>
              <li className="mb-2">Notify us immediately of any unauthorized access</li>
              <li className="mb-2">We are not liable for losses from unauthorized account use</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">4.3 Account Suspension</strong></p>
            <p className="mb-4">We reserve the right to suspend or terminate accounts that:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Violate these Terms and Conditions</li>
              <li className="mb-2">Engage in fraudulent activities</li>
              <li className="mb-2">Provide false information</li>
              <li className="mb-2">Abuse or misuse our services</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              5. Service Orders and Payment
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">5.1 Placing Orders</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Submit complete and accurate assignment requirements</li>
              <li className="mb-2">Provide all necessary files and instructions</li>
              <li className="mb-2">Specify realistic deadlines</li>
              <li className="mb-2">Review and approve quoted prices before payment</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">5.2 Pricing</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Prices are determined based on complexity, deadline, and scope</li>
              <li className="mb-2">Quotes are valid for 48 hours</li>
              <li className="mb-2">Additional charges may apply for rush orders or extended scope</li>
              <li className="mb-2">All prices are in Sri Lankan Rupees (LKR) unless stated otherwise</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">5.3 Payment Terms</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Full payment required before work commences</li>
              <li className="mb-2">Payments processed securely through PayHere gateway</li>
              <li className="mb-2">Payment confirmation via email within 24 hours</li>
              <li className="mb-2">Accepted payment methods: Credit/Debit Cards, Bank Transfers</li>
            </ul>

            {/* Success Box */}
            <div className="bg-[#d4edda] border-l-4 border-[#27ae60] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-shield-check mr-1"></i> Secure Payments:
              </strong>{' '}
              All transactions are processed through PayHere, a PCI DSS compliant payment gateway, ensuring your payment information is secure.
            </div>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              6. Delivery and Timeline
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">6.1 Delivery Commitment</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">We strive to deliver assignments by the agreed deadline</li>
              <li className="mb-2">Delivery timeline starts after payment confirmation</li>
              <li className="mb-2">Rush orders (less than 48 hours) incur additional charges</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">6.2 Delays</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">We will notify you immediately of any potential delays</li>
              <li className="mb-2">Delays caused by incomplete requirements are not our responsibility</li>
              <li className="mb-2">You may be offered a partial refund or extension for our delays</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">6.3 Delivery Method</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Completed assignments delivered via email or dashboard download</li>
              <li className="mb-2">You will receive a notification upon delivery</li>
              <li className="mb-2">Files remain accessible for 30 days after delivery</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              7. Revisions and Modifications
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">7.1 Free Revisions</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Up to 2 free revisions within 7 days of delivery</li>
              <li className="mb-2">Revisions must be within the original scope</li>
              <li className="mb-2">Turnaround time: 2-3 business days</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">7.2 Paid Revisions</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Revisions beyond the free limit incur additional charges</li>
              <li className="mb-2">Scope changes or additions require new quotations</li>
              <li className="mb-2">Late revision requests (after 7 days) may incur fees</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              8. Intellectual Property
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">8.1 Ownership</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Upon full payment, you receive rights to the delivered work</li>
              <li className="mb-2">We retain the right to use anonymized work for portfolio/marketing</li>
              <li className="mb-2">You may not resell or redistribute the work to others</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">8.2 Originality</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">All work is created originally for your assignment</li>
              <li className="mb-2">We guarantee plagiarism-free content</li>
              <li className="mb-2">Plagiarism reports available upon request</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">8.3 Third-Party Content</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">You are responsible for any materials you provide</li>
              <li className="mb-2">We are not liable for copyright issues from your materials</li>
              <li className="mb-2">Properly cited sources will be used where applicable</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              9. Confidentiality
            </h2>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">All personal and assignment information is kept confidential</li>
              <li className="mb-2">We do not share your information with third parties (except payment processor)</li>
              <li className="mb-2">Your assignments will not be sold or published</li>
              <li className="mb-2">Refer to our Privacy Policy for detailed information</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              10. Refund Policy
            </h2>
            <p className="mb-4">Refunds are subject to our Refund Policy. Key points:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Full refund if work not started and cancelled within 24 hours</li>
              <li className="mb-2">Partial refunds based on work completion percentage</li>
              <li className="mb-2">No refund after final delivery and approval</li>
              <li className="mb-2">Quality issues addressed through free revisions first</li>
            </ul>
            <p className="mb-4">For detailed refund terms, please refer to our Return & Refund Policy.</p>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              11. User Responsibilities
            </h2>
            <p className="mb-4">You agree to:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Provide accurate and complete assignment requirements</li>
              <li className="mb-2">Respond to clarification requests promptly</li>
              <li className="mb-2">Review delivered work within 7 days</li>
              <li className="mb-2">Use the service ethically and in accordance with academic policies</li>
              <li className="mb-2">Not submit our work as entirely your own without proper attribution</li>
              <li className="mb-2">Not engage in fraudulent or deceptive practices</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              12. Prohibited Uses
            </h2>
            <p className="mb-4">You may NOT use our services to:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Submit work for high-stakes examinations</li>
              <li className="mb-2">Engage in academic dishonesty or cheating</li>
              <li className="mb-2">Violate any laws or regulations</li>
              <li className="mb-2">Harass, abuse, or harm others</li>
              <li className="mb-2">Distribute malware or viruses</li>
              <li className="mb-2">Attempt to access unauthorized areas of the system</li>
            </ul>

            {/* Danger Box 2 */}
            <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-x-circle-fill mr-1"></i> Violation Notice:
              </strong>{' '}
              Violation of prohibited uses may result in immediate account suspension, order cancellation without refund, and potential legal action.
            </div>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              13. Limitation of Liability
            </h2>
            <p className="mb-4">Assignment Service and its affiliates shall not be liable for:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Academic consequences resulting from use of our services</li>
              <li className="mb-2">Grades or marks received on submitted assignments</li>
              <li className="mb-2">Decisions made by academic institutions regarding your work</li>
              <li className="mb-2">Indirect, incidental, or consequential damages</li>
              <li className="mb-2">Loss of data, profits, or business opportunities</li>
            </ul>
            <p className="mb-4">Our total liability is limited to the amount paid for the specific service.</p>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              14. Indemnification
            </h2>
            <p className="mb-4">You agree to indemnify and hold Assignment Service harmless from any claims, damages, or expenses arising from:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Your violation of these Terms and Conditions</li>
              <li className="mb-2">Your misuse of our services</li>
              <li className="mb-2">Your violation of any third-party rights</li>
              <li className="mb-2">Content you provide to us</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              15. Force Majeure
            </h2>
            <p className="mb-4">We are not liable for delays or failures caused by events beyond our reasonable control, including:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Natural disasters</li>
              <li className="mb-2">Pandemics or health emergencies</li>
              <li className="mb-2">War, terrorism, or civil unrest</li>
              <li className="mb-2">Internet outages or technical failures</li>
              <li className="mb-2">Government actions or regulations</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              16. Modifications to Terms
            </h2>
            <p className="mb-4">We reserve the right to modify these Terms and Conditions at any time:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Changes effective immediately upon posting</li>
              <li className="mb-2">Continued use constitutes acceptance of changes</li>
              <li className="mb-2">Significant changes notified via email</li>
              <li className="mb-2">Review terms periodically for updates</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              17. Modifications to Services
            </h2>
            <p className="mb-4">We reserve the right to:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Modify or discontinue services at any time</li>
              <li className="mb-2">Change pricing with reasonable notice</li>
              <li className="mb-2">Update features and functionality</li>
              <li className="mb-2">Refuse service to anyone for any reason</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              18. Governing Law
            </h2>
            <p className="mb-4">These Terms and Conditions are governed by:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Laws of Sri Lanka</li>
              <li className="mb-2">Jurisdiction of courts in Colombo, Sri Lanka</li>
              <li className="mb-2">Disputes subject to binding arbitration (where applicable)</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              19. Dispute Resolution
            </h2>
            <p className="mb-4"><strong className="text-[#2c3e50]">19.1 Informal Resolution</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Contact us first to resolve disputes informally</li>
              <li className="mb-2">We aim to resolve complaints within 7 business days</li>
            </ul>
            <p className="mb-4"><strong className="text-[#2c3e50]">19.2 Formal Process</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">If informal resolution fails, disputes subject to arbitration</li>
              <li className="mb-2">Arbitration conducted in Colombo, Sri Lanka</li>
              <li className="mb-2">Decision is binding on both parties</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              20. Severability
            </h2>
            <p className="mb-4">If any provision of these Terms is found to be unenforceable:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">That provision will be modified to the minimum extent necessary</li>
              <li className="mb-2">All other provisions remain in full effect</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              21. Entire Agreement
            </h2>
            <p className="mb-4">These Terms and Conditions, along with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Assignment Service.</p>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              22. Contact Information
            </h2>
            <p className="mb-4">For questions or concerns about these Terms and Conditions:</p>

            {/* Contact Info Box */}
            <div className="bg-[#f8f9fa] p-6 rounded-[10px] mt-8 mb-6">
              <ul className="pl-0 list-none mb-0">
                <li className="mb-2"><i className="bi bi-envelope-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Email:</strong> assignmentservice.net@gmail.com</li>
                <li className="mb-2"><i className="bi bi-telephone-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Phone:</strong> +94 788 769 570</li>
                <li className="mb-2"><i className="bi bi-geo-alt-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Address:</strong> Colombo, Sri Lanka</li>
                <li className="mb-2"><i className="bi bi-clock-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</li>
              </ul>
            </div>

            {/* Bottom Highlight Box */}
            <div className="bg-[#e7f3ff] border-l-4 border-[#3498db] p-4 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-check-circle mr-1"></i> Agreement:
              </strong>{' '}
              By using Assignment Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;