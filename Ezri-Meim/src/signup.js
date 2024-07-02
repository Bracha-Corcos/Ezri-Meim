// import React, { useState } from 'react';
// import './style.css'
// import {app} from './firebase'
// import {auth} from './firebase'
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { Link } from 'react-router-dom';

// const Signup = () => {
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
//       await creatUserWhitEmailAndPassword(auth, email,password)
//       console.log("נרשמת בהצלחה")
//     } catch(err) {
//       console.log(err)
//     }
//   }
//   return (
//   <div className = 'signup-container'>
//     <form className= 'signup-form' onSubmit={handleSubmit}>
//       <h2>הרשמה</h2>
//       <labal htmlFor = "firstname">
//         שם פרטי:
//         <input type = "text" onChange={(e) => setFirstName(e.target.value)}/>
//       </labal>
//       <labal htmlFor = "lastname">
//         שם משפחה:
//         <input type = "text" onChange={(e) => setLastName(e.target.value)}/>
//       </labal>
//       <labal htmlFor = "email">
//         אימייל:
//         <input type = "text" onChange={(e) => setEmail(e.target.value)}/>
//       </labal>
//       <labal htmlFor = "username">
//         שם משתמש:
//         <input type = "text" onChange={(e) => setUsername(e.target.value)}/>< input type = "text"/>
//       </labal>
//       <labal htmlFor = "password">
//         סיסמא:
//         <input type = "text" onChange={(e) => setPassword(e.target.value)}/>
//       </labal>
//       <labal htmlFor = "phone">
//         טלפון:
//         <input type = "text" onChange={(e) => setPhone(e.target.value)}/>
//       </labal>
//       <labal htmlFor = "address">
//         כתובת מגורים:
//         <input type = "text" onChange={(e) => setAddress(e.target.value)}/>
//       </labal>

//       <button>הרשמה</button> <br/>
//       <p>כבר רשום? <Link to="/login">התחבר</Link></p>

//     </form>
//   </div>
//   )
// }

// export default Signup

import React, { useState } from 'react';
import './style.css';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("נרשמת בהצלחה");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h2>הרשמה</h2>
        <label htmlFor="firstname">
          שם פרטי:
          <input type="text" onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label htmlFor="lastname">
          שם משפחה:
          <input type="text" onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label htmlFor="email">
          אימייל:
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label htmlFor="username">
          שם משתמש:
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label htmlFor="password">
          סיסמא:
          <input type="text" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label htmlFor="phone">
          טלפון:
          <input type="text" onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label htmlFor="address">
          כתובת מגורים:
          <input type="text" onChange={(e) => setAddress(e.target.value)} />
        </label>
        <button>הרשמה</button> <br />
        <p>כבר רשום? <Link to="/login">התחבר</Link></p>
      </form>
    </div>
  );
};

export default Signup;


