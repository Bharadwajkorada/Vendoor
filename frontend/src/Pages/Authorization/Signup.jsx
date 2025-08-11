// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// axios.defaults.withCredentials = true;
// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     Name: '',
//     Age: '',
//     Email: '',
//     PhoneNumber: '',
//     Businessname: '',
//     Password: '',
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:2500/ab/cd/register', formData, {
//               withCredentials: true
//             });
//       toast.success(res.data.message || 'Registered successfully');
//       navigate(`/business/${res.data.user.id}`);
      
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.response?.data?.error || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="signup-page">
//       <ToastContainer position="top-center" autoClose={3000} />
//       <div className="signup-container">
//         <h2 className="signup-title">Create Account</h2>
//         <form className="signup-form" onSubmit={handleSubmit}>
//           <label className="signup-label" htmlFor="Name">Name</label>
//           <input
//             className="signup-input"
//             type="text"
//             name="Name"
//             id="Name"
//             placeholder="John Doe"
//             value={formData.Name}
//             onChange={handleChange}
//             required
//           />

//           <label className="signup-label" htmlFor="Age">Age</label>
//           <input
//             className="signup-input"
//             type="number"
//             name="Age"
//             id="Age"
//             placeholder="25"
//             value={formData.Age}
//             onChange={handleChange}
//             required
//           />

//           <label className="signup-label" htmlFor="Email">Email</label>
//           <input
//             className="signup-input"
//             type="email"
//             name="Email"
//             id="Email"
//             placeholder="you@example.com"
//             value={formData.Email}
//             onChange={handleChange}
//             required
//           />

//           <label className="signup-label" htmlFor="PhoneNumber">Phone Number</label>
//           <input
//             className="signup-input"
//             type="tel"
//             name="PhoneNumber"
//             id="PhoneNumber"
//             placeholder="9876543210"
//             value={formData.PhoneNumber}
//             onChange={handleChange}
//             required
//           />

//           <label className="signup-label" htmlFor="Businessname">Business Name</label>
//           <input
//             className="signup-input"
//             type="text"
//             name="Businessname"
//             id="Businessname"
//             placeholder="Doe Enterprises"
//             value={formData.Businessname}
//             onChange={handleChange}
//             required
//           />

//           <label className="signup-label" htmlFor="Password">Password</label>
//           <input
//             className="signup-input"
//             type="password"
//             name="Password"
//             id="Password"
//             placeholder="••••••••"
//             value={formData.Password}
//             onChange={handleChange}
//             required
//           />

//           <button className="signup-button" type="submit">Sign Up</button>
//         </form>
//         <div className="signup-footer">
//           Already have an account? <a href="/login">Login</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: '',
    Age: '',
    Email: '',
    PhoneNumber: '',
    Businessname: '',
    Password: '',
    BankDetails: {
      AccountHolderName: '',
      AccountNumber: '',
      IFSC: '',
      BankName: '',
      UPIId: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested bank details
    if (name in formData.BankDetails) {
      setFormData((prev) => ({
        ...prev,
        BankDetails: {
          ...prev.BankDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/ab/cd/register`, formData, {
        withCredentials: true,
      });
      toast.success(res.data.message || 'Registered successfully');
      navigate(`/business/${res.data.user.id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Something went wrong'
      );
    }
  };

  return (
    <div className="signup-page">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="signup-container">
        <h2 className="signup-title">Create Account</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-label" htmlFor="Name">Name</label>
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="Age">Age</label>
          <input type="number" name="Age" value={formData.Age} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="Email">Email</label>
          <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="PhoneNumber">Phone Number</label>
          <input type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="Businessname">Business Name</label>
          <input type="text" name="Businessname" value={formData.Businessname} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="Password">Password</label>
          <input type="password" name="Password" value={formData.Password} onChange={handleChange} required className="signup-input" />

          <h4 className="signup-label">Bank Details</h4>

          <label className="signup-label" htmlFor="AccountHolderName">Account Holder Name</label>
          <input type="text" name="AccountHolderName" value={formData.BankDetails.AccountHolderName} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="AccountNumber">Account Number</label>
          <input type="text" name="AccountNumber" value={formData.BankDetails.AccountNumber} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="IFSC">IFSC Code</label>
          <input type="text" name="IFSC" value={formData.BankDetails.IFSC} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="BankName">Bank Name</label>
          <input type="text" name="BankName" value={formData.BankDetails.BankName} onChange={handleChange} required className="signup-input" />

          <label className="signup-label" htmlFor="UPIId">UPI ID</label>
          <input type="text" name="UPIId" value={formData.BankDetails.UPIId} onChange={handleChange} required className="signup-input" />

          <button className="signup-button" type="submit">Sign Up</button>
        </form>
        <div className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
