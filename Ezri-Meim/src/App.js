// import React, { useState, useEffect, useRef } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from './firebase.js';
// import PropTypes from 'prop-types';
// import Signup from './signup.js';
// import Login from './login.js';
// import Dashboard from './Dashboard.js';
// import HomePage from './HomePage.js';
// import ManageUsers from './ManageUsers.js';
// import UserDetail from './UserDetail.js';
// import MonthlyCalendar from './MonthlyCalendar.js';
// import ResetPassword from './ResetPassword.js';
// import GeneralForum from './generalForum.js';
// import MenForum from './menForum.js';
// import WomenForum from './womenForum.js';
// import BoysForum from './boysForum.js';
// import GirlsForum from './girlsForum.js';

// const PrivateRoute = ({ element, allowedRoles }) => {
//   const userRole = localStorage.getItem('userRole');
//   const isAuthenticated = !!userRole;
//   const isAuthorized = allowedRoles.includes(userRole);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   return isAuthorized ? element : <Navigate to="/dashboard" />;
// };

// PrivateRoute.propTypes = {
//   element: PropTypes.element.isRequired,
//   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

// function App() {
//   const [showWarning, setShowWarning] = useState(false);
//   const [showLogoutMessage, setShowLogoutMessage] = useState(false);
//   const warningTimer = useRef(null);
//   const logoutTimer = useRef(null);
//   const location = useLocation();

//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem('userRole');
//     window.location.href = '/login';
//   };

//   useEffect(() => {
//     const resetTimer = () => {
//       const excludedPaths = ['/login', '/signup', '/reset-password'];
//       if (excludedPaths.includes(location.pathname)) {
//         return; // Do not set timers on these paths
//       }

//       if (showLogoutMessage) return;

//       clearTimeout(warningTimer.current);
//       clearTimeout(logoutTimer.current);
//       setShowWarning(false);
//       setShowLogoutMessage(false);

//       warningTimer.current = setTimeout(showWarningModal, 25 * 60 * 1000);
//       logoutTimer.current = setTimeout(showLogoutModal, 30 * 60 * 1000);
//     };

//     const showWarningModal = () => {
//       setShowWarning(true);
//     };

//     const showLogoutModal = () => {
//       setShowWarning(false);
//       setShowLogoutMessage(true);
//     };

//     window.addEventListener('mousemove', resetTimer);
//     window.addEventListener('keydown', resetTimer);

//     resetTimer(); // Initialize the timer when the page loads

//     return () => {
//       clearTimeout(warningTimer.current);
//       clearTimeout(logoutTimer.current);
//       window.removeEventListener('mousemove', resetTimer);
//       window.removeEventListener('keydown', resetTimer);
//     };
//   }, [showLogoutMessage, location.pathname]);

//   return (
//     <div>
//       {showWarning && (
//         <div className="modal">
//           <div className="modal-content">
//             <p>חוסר פעילות מזה זמן מה. אתה עומד להתנתק. לחץ על כפתור כלשהו כדי להישאר מחובר.</p>
//             <button onClick={() => setShowWarning(false)}>המשך חיבור</button>
//           </div>
//         </div>
//       )}
//       {showLogoutMessage && (
//         <div className="modal">
//           <div className="modal-content">
//             <p>עברת את זמן החיבור המותר. עליך להתחבר מחדש.</p>
//             <button onClick={handleLogout}>התחבר מחדש</button>
//           </div>
//         </div>
//       )}
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route
//           path="/dashboard"
//           element={<PrivateRoute element={<Dashboard />} allowedRoles={['forumMember', 'admin']} />}
//         />
//         <Route path="/manage-users" element={<PrivateRoute element={<ManageUsers />} allowedRoles={['admin']} />} />
//         <Route path="/user-details/:userId" element={<PrivateRoute element={<UserDetail />} allowedRoles={['admin']} />} />
//         <Route path="/" element={<HomePage />} />
//         <Route path="/calendar" element={<MonthlyCalendar />} />
//         <Route
//           path="/forum/generalForum"
//           element={<PrivateRoute element={<GeneralForum />} allowedRoles={['forumMember', 'admin']} />}
//         />
//         <Route
//           path="/forum/menForum"
//           element={<PrivateRoute element={<MenForum />} allowedRoles={['forumMember', 'admin']} />}
//         />
//         <Route
//           path="/forum/womenForum"
//           element={<PrivateRoute element={<WomenForum />} allowedRoles={['forumMember', 'admin']} />}
//         />
//         <Route
//           path="/forum/boysForum"
//           element={<PrivateRoute element={<BoysForum />} allowedRoles={['forumMember', 'admin']} />}
//         />
//         <Route
//           path="/forum/girlsForum"
//           element={<PrivateRoute element={<GirlsForum />} allowedRoles={['forumMember', 'admin']} />}
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import PropTypes from 'prop-types';
import Signup from './signup.js';
import Login from './login.js';
import Dashboard from './Dashboard.js';
import HomePage from './HomePage.js';
import ManageUsers from './ManageUsers.js';
import UserDetail from './UserDetail.js';
import MonthlyCalendar from './MonthlyCalendar.js';
import ResetPassword from './ResetPassword.js';
import GeneralForum from './generalForum.js';
import MenForum from './menForum.js';
import WomenForum from './womenForum.js';
import BoysForum from './boysForum.js';
import GirlsForum from './girlsForum.js';

const PrivateRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = !!userRole;
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return isAuthorized ? element : <Navigate to="/dashboard" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function App() {
  const [showWarning, setShowWarning] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const warningTimer = useRef(null);
  const logoutTimer = useRef(null);
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  useEffect(() => {
    const resetTimer = () => {
      const excludedPaths = ['/login', '/signup', '/reset-password'];
      if (excludedPaths.includes(location.pathname)) {
        return; // Do not set timers on these paths
      }

      if (showLogoutMessage) return;

      clearTimeout(warningTimer.current);
      clearTimeout(logoutTimer.current);
      setShowWarning(false);
      setShowLogoutMessage(false);

      warningTimer.current = setTimeout(showWarningModal, 25 * 60 * 1000);
      logoutTimer.current = setTimeout(showLogoutModal, 30 * 60 * 1000);
    };

    const showWarningModal = () => {
      setShowWarning(true);
    };

    const showLogoutModal = () => {
      setShowWarning(false);
      setShowLogoutMessage(true);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer(); // Initialize the timer when the page loads

    return () => {
      clearTimeout(warningTimer.current);
      clearTimeout(logoutTimer.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [showLogoutMessage, location.pathname]);

  return (
    <div>
      {showWarning && (
        <div className="modal">
          <div className="modal-content">
            <p>חוסר פעילות מזה זמן מה. אתה עומד להתנתק. לחץ על כפתור כלשהו כדי להישאר מחובר.</p>
            <button onClick={() => setShowWarning(false)}>המשך חיבור</button>
          </div>
        </div>
      )}
      {showLogoutMessage && (
        <div className="modal">
          <div className="modal-content">
            <p>עברת את זמן החיבור המותר. עליך להתחבר מחדש.</p>
            <button onClick={handleLogout}>התחבר מחדש</button>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} allowedRoles={['forumMember', 'admin']} />}
        />
        <Route path="/manage-users" element={<PrivateRoute element={<ManageUsers />} allowedRoles={['admin']} />} />
        <Route path="/user-details/:userId" element={<PrivateRoute element={<UserDetail />} allowedRoles={['admin']} />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<MonthlyCalendar />} />
        <Route
          path="/forum/generalForum"
          element={<PrivateRoute element={<GeneralForum />} allowedRoles={['forumMember', 'admin']} />}
        />
        <Route
          path="/forum/menForum"
          element={<PrivateRoute element={<MenForum />} allowedRoles={['forumMember', 'admin']} />}
        />
        <Route
          path="/forum/womenForum"
          element={<PrivateRoute element={<WomenForum />} allowedRoles={['forumMember', 'admin']} />}
        />
        <Route
          path="/forum/boysForum"
          element={<PrivateRoute element={<BoysForum />} allowedRoles={['forumMember', 'admin']} />}
        />
        <Route
          path="/forum/girlsForum"
          element={<PrivateRoute element={<GirlsForum />} allowedRoles={['forumMember', 'admin']} />}
        />
      </Routes>
    </div>
  );
}

export default App;

