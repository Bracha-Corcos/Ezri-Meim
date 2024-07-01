
// // Signup.js
// import React, { useState } from 'react';
// import { db, auth } from './firebase';
// import { doc, setDoc } from 'firebase/firestore';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       // Create user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Save user details to Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         name,
//         email,
//         uid: user.uid
//       });

//       alert('User created successfully!');
//     } catch (error) {
//       console.error('Error signing up:', error);
//       alert('Error signing up. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       <form onSubmit={handleSignup}>
//         <div>
//           <label>Name:</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;


// // Signup.js
// // import React, { useState } from 'react';
// // import { db, auth } from './firebase';
// // import { doc, setDoc } from 'firebase/firestore';
// // import { createUserWithEmailAndPassword } from 'firebase/auth';
// // import { useNavigate } from 'react-router-dom';

// // const Signup = () => {
// //   const [firstName, setFirstName] = useState('');
// //   const [lastName, setLastName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [address, setAddress] = useState('');
// //   const [phone, setPhone] = useState('');
// //   const [username, setUsername] = useState('');
// //   const [password, setPassword] = useState('');
// //   const navigate = useNavigate();

// //   const handleSignup = async (e) => {
// //     e.preventDefault();

// //     if (
// //       firstName.trim() === "" ||
// //       lastName.trim() === "" ||
// //       email.trim() === "" ||
// //       address.trim() === "" ||
// //       phone.trim() === "" ||
// //       username.trim() === "" ||
// //       password.trim() === ""
// //     ) {
// //       alert("One of the fields is empty!");
// //       return;
// //     }

// //     if (!validateEmail(email)) {
// //       alert('Invalid email format');
// //       return;
// //     }

// //     try {
// //       // Create user with email and password
// //       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
// //       const user = userCredential.user;

// //       // Save user details to Firestore
// //       await setDoc(doc(db, 'users', user.uid), {
// //         firstName,
// //         lastName,
// //         email,
// //         address,
// //         phone,
// //         username,
// //         uid: user.uid
// //       });

// //       alert('User created successfully!');
// //       navigate('/home'); // Navigate to the Home page
// //     } catch (error) {
// //       console.error('Error signing up:', error);
// //       alert('Error signing up. Please try again.');
// //     }
// //   };

// //   const validateEmail = (email) => {
// //     const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
// //     return emailPattern.test(email);
// //   };

// //   return (
// //     <div>
// //       <h2>Signup</h2>
// //       <form onSubmit={handleSignup}>
// //         <div>
// //           <label>First Name:</label>
// //           <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
// //         </div>
// //         <div>
// //           <label>Last Name:</label>
// //           <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
// //         </div>
// //         <div>
// //           <label>Email:</label>
// //           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //         </div>
// //         <div>
// //           <label>Address:</label>
// //           <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
// //         </div>
// //         <div>
// //           <label>Phone:</label>
// //           <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
// //         </div>
// //         <div>
// //           <label>Username:</label>
// //           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
// //         </div>
// //         <div>
// //           <label>Password:</label>
// //           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
// //         </div>
// //         <button type="submit">Signup</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Signup;


// Signup.js
import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      address.trim() === "" ||
      phone.trim() === "" ||
      username.trim() === "" ||
      password.trim() === ""
    ) {
      alert("One of the fields is empty!");
      return;
    }

    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        address,
        phone,
        username,
        uid: user.uid
      });

      alert('User created successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;

