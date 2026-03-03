import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import TotalAssignments from './pages/admin/TotalAssignments';
import SolutionDelivery from './pages/admin/SolutionDelivery';
import CustomerProfiles from './pages/admin/CustomerProfiles';
import ViewReports from './pages/admin/ViewReports';
import CustomerDetails from './pages/admin/CustomerDetails';
import SystemManagement from './pages/admin/SystemManagement';
import PendingAssignments from './pages/admin/PendingAssignments';


// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AssignmentDetails from './pages/admin/AssignmentDetails'; // Import kala

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pradhana pituwa (Home page) */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5 font-sans">
            <h1 className="text-4xl font-bold text-[#2c3e50] mb-8 text-center">
              Assignment Service - System Pages
            </h1>
            <div className="flex flex-col gap-4 text-center w-full max-w-xs">
              <Link to="/privacy-policy" className="bg-[#3498db] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-md font-bold">
                Privacy Policy
              </Link>
              <Link to="/return-policy" className="bg-[#27ae60] text-white px-6 py-3 rounded-lg hover:bg-green-600 transition shadow-md font-bold">
                Return & Refund Policy
              </Link>
              <Link to="/terms-and-conditions" className="bg-[#764ba2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition shadow-md font-bold">
                Terms & Conditions
              </Link>
              
              <div className="mt-6 border-t pt-6">
                <Link to="/admin/dashboard" className="bg-[#2c3e50] text-white px-6 py-3 rounded-lg hover:bg-black transition shadow-lg font-bold flex items-center justify-center gap-2">
                  <i className="bi bi-shield-lock"></i> Go to Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        } />

        {/* Static Pages Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Dynamic Route eka (:id kiyanne assignment eke number eka) */}
        <Route path="/admin/assignments/:id" element={<AssignmentDetails />} />
        <Route path="/admin/assignments" element={<TotalAssignments />} />
        <Route path="/admin/assignments/:id/deliver" element={<SolutionDelivery />} />
        <Route path="/admin/customers" element={<CustomerProfiles />} />
        <Route path="/admin/reports" element={<ViewReports />} />
        <Route path="/admin/customers/:id" element={<CustomerDetails />} />
        <Route path="/admin/system" element={<SystemManagement />} />
        <Route path="/admin/assignments/pending" element={<PendingAssignments />} />
        


      </Routes>
    </BrowserRouter>
  );
}

export default App;