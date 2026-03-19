import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Public & Static Pages ---
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// --- Auth Pages ---
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RegistrationSuccess from './pages/RegistrationSuccess';
import VerificationSent from './pages/VerificationSent';
import ResendVerification from './pages/ResendVerification';

// --- User Pages ---
import Dashboard from './pages/Dashboard';
import CreateAssignment from './pages/CreateAssignment';
import MyAssignments from './pages/MyAssignments';
import ViewAssignment from './pages/ViewAssignment'; 
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import EmailPreview from './pages/EmailPreview';
import SubmitFeedback from './pages/SubmitFeedback';
import AllFeedbacks from './pages/AllFeedbacks';
import Checkout from './pages/payment/Checkout';
import PaymentMethodSelection from './pages/payment/PaymentMethodSelection';
import PaymentResult from './pages/payment/PaymentResult';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import TotalAssignments from './pages/admin/TotalAssignments';
import PendingAssignments from './pages/admin/PendingAssignments';
import AssignmentDetails from './pages/admin/AssignmentDetails';
import SolutionDelivery from './pages/admin/SolutionDelivery';
import CustomerProfiles from './pages/admin/CustomerProfiles';
import CustomerDetails from './pages/admin/CustomerDetails';
import ViewReports from './pages/admin/ViewReports';
import SystemManagement from './pages/admin/SystemManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- Public & Static Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* --- Auth Routes --- */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/verification-sent" element={<VerificationSent />} />
        <Route path="/resend-verification" element={<ResendVerification />} />

        {/* --- User Routes --- */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignments/create" element={<CreateAssignment />} />
        <Route path="/assignments/my-assignments" element={<MyAssignments />} />
        <Route path="/assignments/:id" element={<ViewAssignment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/email-preview" element={<EmailPreview />} />
        <Route path="/feedback/submit" element={<SubmitFeedback />} />
        <Route path="/feedback/all" element={<AllFeedbacks />} />
        <Route path="/payment/checkout" element={<Checkout />} />
        <Route path="/payment/method-selection" element={<PaymentMethodSelection />} />
        <Route path="/payment/result" element={<PaymentResult />} />

        {/* --- Admin Routes --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/assignments" element={<TotalAssignments />} />
        <Route path="/admin/assignments/pending" element={<PendingAssignments />} />
        <Route path="/admin/assignments/:id" element={<AssignmentDetails />} />
        <Route path="/admin/assignments/:id/deliver" element={<SolutionDelivery />} />
        <Route path="/admin/customers" element={<CustomerProfiles />} />
        <Route path="/admin/customers/:id" element={<CustomerDetails />} />
        <Route path="/admin/reports" element={<ViewReports />} />
        <Route path="/admin/system" element={<SystemManagement />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;