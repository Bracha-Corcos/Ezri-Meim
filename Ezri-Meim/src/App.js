// // import React from 'react';
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import PropTypes from 'prop-types';
// // import Signup from './signup.js';
// // import Login from './login.js';
// // import Dashboard from './Dashboard.js';
// // import HomePage from './HomePage.js';
// // import ManageUsers from './ManageUsers.js';
// // import UserDetail from './UserDetail.js'; 

// // const PrivateRoute = ({ element, allowedRoles }) => {
// //   const userRole = localStorage.getItem('userRole');
// //   const isAuthenticated = !!userRole;
// //   const isAuthorized = allowedRoles.includes(userRole);

// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" />;
// //   }

// //   return isAuthorized ? element : <Navigate to="/dashboard" />;
// // };

// // PrivateRoute.propTypes = {
// //   element: PropTypes.element.isRequired,
// //   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
// // };

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/signup" element={<Signup />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route 
// //           path="/dashboard" 
// //           element={<PrivateRoute element={<Dashboard />} allowedRoles={['forumMember', 'volunteer', 'admin']} />} 
// //         />
// //         <Route path="/manage-users" element={<PrivateRoute element={<ManageUsers />} allowedRoles={['admin']} />} />
// //         <Route path="/user-details/:userId" element={<PrivateRoute element={<UserDetail />} allowedRoles={['admin']} />} />
// //         <Route path="/" element={<HomePage />} /> {/* Default route set to HomePage */}
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;


// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import Signup from './signup.js';
// import Login from './login.js';
// import Dashboard from './Dashboard.js';
// import HomePage from './HomePage.js';
// import ManageUsers from './ManageUsers.js';
// import UserDetail from './UserDetail.js'; 
// import MonthlyCalendar from './MonthlyCalendar.js';


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
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route 
//           path="/dashboard" 
//           element={<PrivateRoute element={<Dashboard />} allowedRoles={['forumMember', 'volunteer', 'admin']} />} 
//         />
//         <Route path="/manage-users" element={<PrivateRoute element={<ManageUsers />} allowedRoles={['admin']} />} />
//         <Route path="/user-details/:userId" element={<PrivateRoute element={<UserDetail />} allowedRoles={['admin']} />} />
//         <Route path="/" element={<HomePage />} />
//         <Route path="/calendar" element={<MonthlyCalendar />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Signup from './signup.js';
import Login from './login.js';
import Dashboard from './Dashboard.js';
import HomePage from './HomePage.js';
import ManageUsers from './ManageUsers.js';
import UserDetail from './UserDetail.js'; 
import MonthlyCalendar from './MonthlyCalendar.js';

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<Dashboard />} allowedRoles={['forumMember', 'volunteer', 'admin']} />} 
        />
        <Route path="/manage-users" element={<PrivateRoute element={<ManageUsers />} allowedRoles={['admin']} />} />
        <Route path="/user-details/:userId" element={<PrivateRoute element={<UserDetail />} allowedRoles={['admin']} />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<MonthlyCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
