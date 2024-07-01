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

//chat 
// import React, { useRef, useState } from 'react';
// import './App.css';

// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
// import 'firebase/analytics';

// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';

// firebase.initializeApp({
//   apiKey: "AIzaSyBMUpdXaqI8Vg9E3Se963dvQhRehJ9PFI0",
//   authDomain: "ezri-meim.firebaseapp.com",
//   projectId: "ezri-meim",
//   storageBucket: "ezri-meim.appspot.com",
//   messagingSenderId: "297701922194",
//   appId: "1:297701922194:web:40adc902b18c376cb21d4b",
//   measurementId: "G-MF1NSVVWRP"
// })

// const auth = firebase.auth();
// const firestore = firebase.firestore();
// const analytics = firebase.analytics();


// function App() {

//   const [user] = useAuthState(auth);

//   return (
//     <div className="App">
//       <header>
//         <h1>⚛️🔥💬</h1>
//         <SignOut />
//       </header>

//       <section>
//         {user ? <ChatRoom /> : <SignIn />}
//       </section>

//     </div>
//   );
// }

// function SignIn() {

//   const signInWithGoogle = () => {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider);
//   }

//   return (
//     <>
//       <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
//       <p>Do not violate the community guidelines or you will be banned for life!</p>
//     </>
//   )

// }

// App.js - chat gpt
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Home from './Home'; // Import Home component
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<h1>Welcome to the App</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

