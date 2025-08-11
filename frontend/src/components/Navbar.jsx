import React , { useEffect, useState }from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${BASE_URL}/ab/cd/checkauth`, { withCredentials: true })
      .then(res => setIsAuthenticated(true))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // User is not authenticated
          setIsAuthenticated(false);
        } else {
          // Handle other errors if needed
          console.error(err);
        }
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/ab/cd/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate(`/`)
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
           Vendoor
        </Link>
        <ul className="navbar-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/features" className="nav-link">Features</Link></li>
          <li><Link to="/business" className="nav-link">For Businesses</Link></li>
          <li><Link to="/customer" className="nav-link">For Customers</Link></li>
          <li><Link to="/about" className="nav-link">About Us</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>
        <div className="navbar-auth">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="login-btn">Logout</button>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
           )} 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
