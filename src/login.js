// import React, { useState } from 'react';
// import './style.css'
// import {app} from './firebase'
// import {auth} from './firebase'
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [firstname,setFirstName] = useState('')
//   const [lastname,setLastName] = useState('')
//   const [email,setEmail] = useState('')
//   const [username,setUsername] = useState('')
//   const [password,setPassword] = useState('')
//   const [phone,setPhone] = useState('')
//   const [address,setAddress] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       await signInWithEmailAndPassword(auth, email,password)
//       console.log("התחברת בהצלחה")
//     } catch(err) {
//       console.log(err)
//     }
//   }
//   return (
//   <div className = 'signup-container'>
//     <form className= 'signup-form' onSubmit={handleSubmit}>
//       <h2>התחברות</h2>
//       <labal htmlFor = "email">
//         אימייל:
//         <input type = "text" onChange={(e) => setEmail(e.target.value)}/>
//       </labal>
//       <labal htmlFor = "password">
//         סיסמא:
//         <input type = "text" onChange={(e) => setPassword(e.target.value)}/>
//       </labal>

//       <button>התחברות</button> <br/>
//       <p> אין לך חשבון?הרשם <Link to="/singup">הרשמה</Link></p>

//     </form>
//   </div>
//   )
// }

// export default Login





import React, { useState } from 'react';
import './style.css';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("התחברת בהצלחה");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h2>התחברות</h2>
        <label htmlFor="email">
          אימייל:
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label htmlFor="password">
          סיסמא:
          <input type="text" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button>התחברות</button> <br />
        <p> אין לך חשבון? <Link to="/signup">הרשמה</Link></p>
      </form>
    </div>
  );
};

export default Login;
