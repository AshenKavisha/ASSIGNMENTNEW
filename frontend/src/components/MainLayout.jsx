import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const MainLayout = () => {
  // දැනට අපි හිතමු යූසර් ලොග් වෙලා ඉන්නේ කියලා. 
  // පස්සේ අපිට මේක ඇත්තම Authentication එකට සෙට් කරන්න පුළුවන්.
  const isLoggedIn = true; 
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout ලොජික් එක මෙතනට එනවා
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* --- Navigation --- */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-journal-text me-2"></i> Assignment Service
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* වම් පැත්තේ මෙනු එක */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>

            {/* දකුණු පැත්තේ මෙනු එක (Auth මත පදනම්ව) */}
            <ul className="navbar-nav align-items-center">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      <i className="bi bi-speedometer2"></i> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/assignments/my-assignments">
                      <i className="bi bi-list-task"></i> My Assignments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/feedback/submit">
                      <i className="bi bi-chat-left-text"></i> Feedback
                    </Link>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <button onClick={handleLogout} className="btn btn-danger btn-sm px-3 rounded-pill shadow-sm">
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary btn-sm ms-lg-2 px-3 rounded-pill shadow-sm" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      {/* මෙතන තමයි Outlet එක හරහා අනිත් පේජ් ලෝඩ් වෙන්නේ */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="bg-dark text-white mt-auto py-4 border-top border-secondary">
        <div className="container text-center">
          <p className="mb-1">&copy; 2026 Assignment Service. All rights reserved.</p>
          <p className="mb-0 text-white-50 small">Helping students with IT and QS assignments</p>
        </div>
      </footer>

      {/* Thymeleaf Layout එකේ තිබ්බ CSS ටික මෙතනටත් දාන්න පුළුවන් */}
      <style>{`
        .navbar-brand { font-size: 1.25rem; }
        .nav-link { font-weight: 500; transition: color 0.3s; }
        .nav-link:hover { color: #3498db !important; }
        main { min-height: 70vh; }
      `}</style>
    </div>
  );
};

export default MainLayout;