import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/ab/cd/login`, // Adjust this if needed
        { Email: email, Password: password },
        { withCredentials: true }
      );
      // console.log("124")
      toast.success('Login successful');
      navigate(`/business/${res.data.user.id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed'
      );
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label className="login-label" htmlFor="email">Email</label>
          <input
            className="login-input"
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label" htmlFor="password">Password</label>
          <input
            className="login-input"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-button" type="submit">Login</button>
        </form>
        <div className="login-footer">
          Don’t have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
