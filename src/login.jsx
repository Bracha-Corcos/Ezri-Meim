// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const _firebaseProjectID = "ezri-meim";

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (username.trim() === "" || password.trim() === "") {
//       alert("One of the fields is empty!");
//       return;
//     }

//     const requestBody = {
//       structuredQuery: {
//         from: [
//           { collectionId: "users" }
//         ],
//         where: {
//           compositeFilter: {
//             op: "AND",
//             filters: [
//               {
//                 fieldFilter: {
//                   field: { fieldPath: "userId" },
//                   op: "EQUAL",
//                   value: { stringValue: username }
//                 }
//               },
//               {
//                 fieldFilter: {
//                   field: { fieldPath: "password" },
//                   op: "EQUAL",
//                   value: { stringValue: password }
//                 }
//               }
//             ]
//           }
//         }
//       }
//     };

//     try {
//       const url = `https://firestore.googleapis.com/v1/projects/${_firebaseProjectID}/databases/(default)/documents:runQuery`;
//       const response = await axios.post(url, requestBody, { headers: { 'Content-Type': 'application/json' } });
//       const data = response.data;

//       if (data.length > 0 && data[0].document !== undefined) {
//         localStorage.setItem("UserId", username);
//         localStorage.setItem("UserDocumentId", JSON.stringify(data[0].document));
//         navigate('/home'); // Navigate to the Home page
//       } else {
//         alert("User name or password is incorrect");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;

// Login.js
import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("One of the fields is empty!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

