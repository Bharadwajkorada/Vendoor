import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Authorization/Login";
import Signup from "./Pages/Authorization/Signup";
import Notfound from "./Pages/NotFound/Notfound";
import Home_Business from "./Pages/Home/Home_Business";
import PublicBusinessPage from "./Pages/People/PublicBusinessPage";
import Checkout from "./Pages/People/Checkout";
function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/business/:businessId" element={<Home_Business/>} />
        <Route path="/people/:businessName" element={<PublicBusinessPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/*" element={< Notfound/>} /> 
      </Routes>
    </Router>
    </>
    
  );
}

export default App;