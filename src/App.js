import React from 'react'
import Signup from './signup'
import Login from './login'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App () {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = '/signup' element={<Signup/>}></Route>
      <Route path = '/login' element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './login';
// import Signup from './signup';
// //import Home from './home'; // Import Home component
// import './App.css';

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           {/* <Route path="/home" element={<Home />} /> */} {/* Uncomment when Home component is ready */}
//           <Route path="/" element={<h1>Welcome to the App</h1>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

