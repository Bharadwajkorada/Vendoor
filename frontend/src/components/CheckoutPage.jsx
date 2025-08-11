

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css";

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [userDetails, setUserDetails] = useState({
//     userName: "",
//     phone: "",
//     address: "",
//     transactionId: "",
//   });
//   const [error, setError] = useState("");
//   const [bankDetails, setBankDetails] = useState(null);

//   const timerRef = useRef();
//   const releasedRef = useRef(true);

//   const releaseItemsOnce = () => {
//     if (releasedRef.current) {
//       releasedRef.current = false;
//       return;
//     }

//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     axios
//       .post("http://localhost:2500/ab/cd/business/people/release_items", { cart: storedCart })
//       .catch(() => { })
//       .finally(() => {
//         localStorage.removeItem("cart");
//       });
//   };

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);

//     if (storedCart.length > 0) {
//       const businessName = storedCart[0].businessName;
//       axios
//         .get(`http://localhost:2500/ab/cd/business/bank-details/${businessName}`)
//         .then((res) => setBankDetails(res.data.bankDetails))
//         .catch((err) => {
//           console.error("Failed to load bank details:", err);
//         });
//     }

//     timerRef.current = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     const handleBeforeUnload = (e) => {
//       releaseItemsOnce();
//       e.preventDefault();
//       e.returnValue = "";
//     };

//     const handlePopState = () => {
//       releaseItemsOnce();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       clearInterval(timerRef.current);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handlePopState);
//       releaseItemsOnce();
//     };
//   }, []);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       toast.info("Time expired. Returning to home.");
//       releaseItemsOnce();
//       clearInterval(timerRef.current);
//       setTimeout(() => navigate("/"), 2000);
//     }
//   }, [timeLeft]);

//   const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

//   const handleInputChange = (e) => {
//     setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
//   };

//   const handleCheckout = async () => {
//     const { userName, phone, address, transactionId } = userDetails;

//     if (!userName || !phone || !address || !transactionId) {
//       setError("Please fill all fields.");
//       return;
//     }


//     try {
//       const res = await axios.post("http://localhost:2500/ab/cd/confirm-order", {
//         cart,
//         ...userDetails,
//       });
//       console.log("order placed")
//       localStorage.removeItem("cart");
//       clearInterval(timerRef.current);
//       releasedRef.current = true;
//       toast.success(`Order placed! Order #${res.data.orderNumber}`);
//       setTimeout(() => navigate("/"), 2000);
//     } catch (err) {
//       toast.error("Order failed.");
//     }
//   };

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="checkout_container">
//       <h2>Checkout</h2>
//       <p style={{ color: "red", fontWeight: "bold" }}>
//         Time left: {formatTime(timeLeft)}
//       </p>

//       <div className="checkout_cartSummary">
//         <h3>Items in Cart</h3>
//         {cart.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           <ul>
//             {cart.map((item) => (
//               <li key={item._id}>
//                 {item.name} - ₹{item.price} × {item.quantity}
//               </li>
//             ))}
//           </ul>
//         )}
//         <h4>Total: ₹{total}</h4>
//       </div>

//       <div className="checkout_userForm">
//         <h3>Delivery Details</h3>
//         {error && <p className="checkout_error">{error}</p>}
//         <input
//           type="text"
//           name="userName"
//           placeholder="Full Name"
//           value={userDetails.userName} // ✅ was userDetails.name (wrong key)
//           onChange={handleInputChange}
//           className="checkout_input"
//         />
//         <input
//           type="tel"
//           name="phone"
//           placeholder="Phone"
//           value={userDetails.phone}
//           onChange={handleInputChange}
//           className="checkout_input"
//         />
//         <textarea
//           name="address"
//           placeholder="Address"
//           value={userDetails.address}
//           onChange={handleInputChange}
//           className="checkout_textarea"
//         />
//         <input
//           type="text"
//           name="transactionId"
//           placeholder="Transaction ID"
//           value={userDetails.transactionId}
//           onChange={handleInputChange}
//           className="checkout_input"
//         />
//         <button onClick={handleCheckout} className="checkout_placeOrderBtn">
//           Place Order
//         </button>
//       </div>

//       {bankDetails && (
//         <div className="checkout_bankDetails">
//           <h3>Seller Bank Details</h3>
//           <p><strong>Account Holder:</strong> {bankDetails.AccountHolderName}</p>
//           <p><strong>Account Number:</strong> {bankDetails.AccountNumber}</p>
//           <p><strong>IFSC Code:</strong> {bankDetails.IFSC}</p>
//           <p><strong>Bank Name:</strong> {bankDetails.BankName}</p>
//           <p><strong>UPI ID:</strong> {bankDetails.UPIId}</p>
//         </div>
//       )}

//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
  };

  const [cart, setCart] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userDetails, setUserDetails] = useState({
    userName: "",
    phone: "",
    address: "",
    transactionId: "",
  });
  const [error, setError] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const timerRef = useRef();
  const releasedRef = useRef(true);

  const releaseItemsOnce = () => {
    if (releasedRef.current) {
      releasedRef.current = false;
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    axios
      .post(`${BASE_URL}/ab/cd/business/people/release_items`, {
        cart: storedCart,
      })
      .catch(() => { })
      .finally(() => {
        localStorage.removeItem("cart");
      });
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    if (storedCart.length > 0) {
      const businessName = storedCart[0].businessName;
      axios
        .get(
          `${BASE_URL}/ab/cd/business/bank-details/${businessName}`
        )
        .then((res) => setBankDetails(res.data.bankDetails))
        .catch((err) => {
          console.error("Failed to load bank details:", err);
        });
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const handleBeforeUnload = (e) => {
      releaseItemsOnce();
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePopState = () => {
      releaseItemsOnce();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      releaseItemsOnce();
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.info("Time expired. Returning to home.");
      releaseItemsOnce();
      clearInterval(timerRef.current);
      setTimeout(() => navigate("/"), 2000);
    }
  }, [timeLeft]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    const { userName, phone, address, transactionId } = userDetails;

    if (!userName || !phone || !address || !transactionId) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/ab/cd/confirm-order`, {
        cart,
        ...userDetails,
      });

      localStorage.removeItem("cart");
      clearInterval(timerRef.current);
      releasedRef.current = true;
      setOrderId(res.data.orderNumber); // order ID popup
      setShowPopup(true); // show the popup
    } catch (err) {
      toast.error("Order failed.");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout_container">
      <h2>Checkout</h2>
      <p style={{ color: "red", fontWeight: "bold" }}>
        Time left: {formatTime(timeLeft)}
      </p>

      <div className="checkout_cartSummary">
        <h3>Items in Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                {item.name} - ₹{item.price} × {item.quantity}
              </li>
            ))}
          </ul>
        )}
        <h4>Total: ₹{total}</h4>
      </div>

      <div className="checkout_userForm">
        <h3>Delivery Details</h3>
        {error && <p className="checkout_error">{error}</p>}
        <input
          type="text"
          name="userName"
          placeholder="Full Name"
          value={userDetails.userName}
          onChange={handleInputChange}
          className="checkout_input"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={userDetails.phone}
          onChange={handleInputChange}
          className="checkout_input"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={userDetails.address}
          onChange={handleInputChange}
          className="checkout_textarea"
        />
        <input
          type="text"
          name="transactionId"
          placeholder="Transaction ID"
          value={userDetails.transactionId}
          onChange={handleInputChange}
          className="checkout_input"
        />
        <button onClick={handleCheckout} className="checkout_placeOrderBtn">
          Place Order
        </button>
      </div>

      {bankDetails && (
        <div className="checkout_bankDetails">
          <h3>Seller Bank Details</h3>
          <p><strong>Account Holder:</strong> {bankDetails.AccountHolderName}</p>
          <p><strong>Account Number:</strong> {bankDetails.AccountNumber}</p>
          <p><strong>IFSC Code:</strong> {bankDetails.IFSC}</p>
          <p><strong>Bank Name:</strong> {bankDetails.BankName}</p>
          <p><strong>UPI ID:</strong> {bankDetails.UPIId}</p>
        </div>
      )}

      {showPopup && (
        <div className="popup_overlay">
          <div className="popup_content">
            <h3>✅ Order Confirmed</h3>
            <p>Your order has been placed successfully!</p>
            <p>
              <strong>Order ID:</strong> {orderId}{" "}
              <span
    className="copy_icon"
    onClick={copyToClipboard}
    title="Copy to clipboard"
  >
    📋
  </span>
            </p>
            <p style={{ color: "red", fontWeight: "bold" }}>
              Please note down your Order ID to track your order later.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate("/");
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}


      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default CheckoutPage;
