import React from 'react';

const PrivacyPolicy = () => {
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
              <i className="bi bi-shield-lock"></i> Privacy Policy
            </h1>
            <p className="mt-2 opacity-90">Last Updated: January 16, 2026</p>
          </div>

          {/* Card Body eka */}
          <div className="p-8 md:p-12 text-[#555]">
            
            {/* Highlight Box */}
            <div className="bg-[#e7f3ff] border-l-4 border-[#3498db] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-info-circle mr-1"></i> Your Privacy Matters:
              </strong>{' '}
              This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our assignment services.
            </div>

            <h2 className="text-[#2c3e50] mt-0 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              1. Information We Collect
            </h2>

            <p className="mb-4"><strong className="text-[#2c3e50]">1.1 Personal Information</strong></p>
            <p className="mb-4">When you register and use our services, we collect:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Full name</li>
              <li className="mb-2">Email address</li>
              <li className="mb-2">Phone number</li>
              <li className="mb-2">Academic institution details</li>
              <li className="mb-2">Payment information (processed securely through PayHere)</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">1.2 Assignment Information</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Assignment requirements and instructions</li>
              <li className="mb-2">Uploaded files and documents</li>
              <li className="mb-2">Subject and course information</li>
              <li className="mb-2">Deadlines and preferences</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">1.3 Technical Information</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">IP address</li>
              <li className="mb-2">Browser type and version</li>
              <li className="mb-2">Device information</li>
              <li className="mb-2">Operating system</li>
              <li className="mb-2">Cookies and usage data</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use your information for the following purposes:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Service Delivery:</strong> To process and complete your assignment requests</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Communication:</strong> To send updates, notifications, and respond to inquiries</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Payment Processing:</strong> To process payments securely through PayHere</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Account Management:</strong> To maintain and manage your user account</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Quality Improvement:</strong> To improve our services and user experience</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Legal Compliance:</strong> To comply with legal obligations and prevent fraud</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              3. Data Sharing and Disclosure
            </h2>

            {/* Success Box */}
            <div className="bg-[#d4edda] border-l-4 border-[#27ae60] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-shield-check mr-1"></i> Our Commitment:
              </strong>{' '}
              We do NOT sell, trade, or rent your personal information to third parties for marketing purposes.
            </div>

            <p className="mb-4">We may share your information only in the following circumstances:</p>

            <p className="mb-4"><strong className="text-[#2c3e50]">3.1 Service Providers</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">PayHere:</strong> Payment gateway for processing transactions</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Email Service:</strong> For sending notifications and updates</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Cloud Storage:</strong> For secure file storage (if applicable)</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">3.2 Legal Requirements</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">When required by law or legal process</li>
              <li className="mb-2">To protect our rights and property</li>
              <li className="mb-2">To prevent fraud or illegal activities</li>
              <li className="mb-2">In response to valid requests from law enforcement</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">3.3 Business Transfers</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">In the event of merger, acquisition, or sale of assets</li>
              <li className="mb-2">Users will be notified before information is transferred</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              4. Data Security
            </h2>
            <p className="mb-4">We implement industry-standard security measures to protect your data:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Encryption:</strong> SSL/TLS encryption for data transmission</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Secure Servers:</strong> Data stored on secure, protected servers</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Access Controls:</strong> Limited access to personal information</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Regular Audits:</strong> Security assessments and updates</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Password Protection:</strong> Encrypted password storage</li>
            </ul>

            {/* Warning Box */}
            <div className="bg-[#fff3cd] border-l-4 border-[#f39c12] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-exclamation-triangle mr-1"></i> Important:
              </strong>{' '}
              While we strive to protect your information, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
            </div>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              5. Payment Information
            </h2>
            <p className="mb-4">Your payment security is our priority:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">All payments are processed through <strong className="text-[#2c3e50]">PayHere</strong>, a certified payment gateway</li>
              <li className="mb-2">We do NOT store your complete credit/debit card details</li>
              <li className="mb-2">Only transaction references and payment status are stored</li>
              <li className="mb-2">PayHere complies with PCI DSS security standards</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              6. Cookies and Tracking
            </h2>
            <p className="mb-4">We use cookies to enhance your experience:</p>

            <p className="mb-4"><strong className="text-[#2c3e50]">Essential Cookies:</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Required for website functionality</li>
              <li className="mb-2">Authentication and security</li>
              <li className="mb-2">Session management</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">Analytics Cookies:</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Understanding user behavior</li>
              <li className="mb-2">Improving website performance</li>
              <li className="mb-2">Measuring service effectiveness</li>
            </ul>

            <p className="mb-4">You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.</p>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              7. Data Retention
            </h2>
            <p className="mb-4">We retain your information as follows:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Account Information:</strong> Until you request account deletion</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Assignment Records:</strong> Retained for 2 years for quality assurance</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Payment Records:</strong> Retained for 7 years for legal/tax compliance</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Communication Logs:</strong> Retained for 1 year for support purposes</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              8. Your Rights
            </h2>
            <p className="mb-4">You have the following rights regarding your personal information:</p>

            <p className="mb-4"><strong className="text-[#2c3e50]">8.1 Access and Correction</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Request a copy of your personal data</li>
              <li className="mb-2">Update or correct inaccurate information</li>
              <li className="mb-2">Access your account settings anytime</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">8.2 Deletion</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Request deletion of your account and data</li>
              <li className="mb-2">Subject to legal retention requirements</li>
              <li className="mb-2">Some data may be retained in backups for 30 days</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">8.3 Data Portability</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Request export of your data in a common format</li>
              <li className="mb-2">Transfer data to another service provider</li>
            </ul>

            <p className="mb-4"><strong className="text-[#2c3e50]">8.4 Opt-Out</strong></p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Unsubscribe from marketing emails</li>
              <li className="mb-2">Disable non-essential cookies</li>
              <li className="mb-2">Request to stop processing for certain purposes</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              9. Children's Privacy
            </h2>
            <p className="mb-4">Our services are intended for undergraduate students (typically 18+ years old):</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">We do not knowingly collect information from children under 18</li>
              <li className="mb-2">If you are under 18, please have a parent/guardian use our services</li>
              <li className="mb-2">If we discover we have collected data from a minor, we will delete it immediately</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              10. Third-Party Links
            </h2>
            <p className="mb-4">Our website may contain links to third-party websites:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">We are not responsible for their privacy practices</li>
              <li className="mb-2">We recommend reviewing their privacy policies</li>
              <li className="mb-2">This policy applies only to our services</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              11. International Data Transfers
            </h2>
            <p className="mb-4">Your information may be transferred and processed in different countries:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Primary servers located in Sri Lanka</li>
              <li className="mb-2">Data may be processed in other countries for service provision</li>
              <li className="mb-2">We ensure appropriate safeguards are in place</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              12. Changes to Privacy Policy
            </h2>
            <p className="mb-4">We may update this Privacy Policy from time to time:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Updates will be posted on this page</li>
              <li className="mb-2">Last updated date will be revised</li>
              <li className="mb-2">Significant changes will be notified via email</li>
              <li className="mb-2">Continued use constitutes acceptance of changes</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              13. Your Consent
            </h2>
            <p className="mb-4">By using our services, you consent to:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2">Collection of your information as described</li>
              <li className="mb-2">Processing of your data for service delivery</li>
              <li className="mb-2">Use of cookies and tracking technologies</li>
              <li className="mb-2">Communication from us regarding your assignments</li>
            </ul>

            <h2 className="text-[#2c3e50] mt-8 mb-4 text-2xl border-b-2 border-[#3498db] pb-2 font-bold">
              14. Data Protection Officer
            </h2>
            <p className="mb-4">For privacy-related inquiries, you can contact our Data Protection Officer:</p>
            <ul className="mb-4 pl-8 list-disc">
              <li className="mb-2"><strong className="text-[#2c3e50]">Email:</strong> privacy@assignmentservice.com</li>
              <li className="mb-2"><strong className="text-[#2c3e50]">Response Time:</strong> Within 3 business days</li>
            </ul>

            {/* Contact Info Box */}
            <div className="bg-[#f8f9fa] p-6 rounded-[10px] mt-8">
              <h2 className="text-[#2c3e50] text-2xl font-bold mb-4 flex items-center gap-2">
                <i className="bi bi-envelope"></i> Contact Us
              </h2>
              <p className="mb-4">For questions about this Privacy Policy or to exercise your rights, please contact us:</p>
              <ul className="mb-4 pl-0 list-none">
                <li className="mb-2"><i className="bi bi-envelope-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Email:</strong> assignmentservice.net@gmail.com</li>
                <li className="mb-2"><i className="bi bi-telephone-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Phone:</strong> +94 788 769 570</li>
                <li className="mb-2"><i className="bi bi-geo-alt-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Address:</strong> Colombo, Sri Lanka</li>
                <li className="mb-2"><i className="bi bi-clock-fill mr-2 text-[#2c3e50]"></i> <strong className="text-[#2c3e50]">Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</li>
              </ul>
            </div>

            {/* Bottom Success Box */}
            <div className="bg-[#d4edda] border-l-4 border-[#27ae60] p-4 my-6 rounded">
              <strong className="text-[#2c3e50]">
                <i className="bi bi-check-circle mr-1"></i> Your Trust is Important:
              </strong>{' '}
              We are committed to protecting your privacy and handling your data responsibly. Thank you for trusting us with your information.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;