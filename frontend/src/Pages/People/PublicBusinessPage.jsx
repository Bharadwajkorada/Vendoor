// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PublicBusinessPage = () => {
//   const { businessName } = useParams();
//   const [business, setBusiness] = useState(null);
//   const [items, setItems] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!businessName) return;

//     const fetchBusinessData = async () => {
//       try {
//         const res = await axios.get(`http://localhost:2500/ab/cd/business/people/${businessName}`);
//         setBusiness(res.data.business);
//         setItems(res.data.business.items || []);
//       } catch (err) {
//         console.error(err);
//         setError("Business not found or server error.");
//       }
//     };
//     fetchBusinessData();
//   }, [businessName]);

//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) setCart(JSON.parse(storedCart));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (item) => {
//     const existing = cart.find((i) => i._id === item._id);
//     if (existing) {
//       setCart((prev) =>
//         prev.map((i) =>
//           i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
//         )
//       );
//     } else {
//       setCart((prev) => [
//         ...prev,
//         { ...item, quantity: 1, businessName: business?.Businessname || "" } // ✅ Add business name here
//       ]);
//     }
//     toast.success(`${item.name} added to cart`);
//   };


//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((i) => i._id !== id));
//     toast.info("Item removed from cart");
//   };

//   const updateQuantity = (id, qty) => {
//     if (qty < 1 || isNaN(qty)) return;
//     setCart((prev) =>
//       prev.map((i) => (i._id === id ? { ...i, quantity: qty } : i))
//     );
//   };

//   // const handleBuyNow = async () => {
//   //     try {
//   //       const res = await axios.get(`http://localhost:2500/ab/cd/business/people/${businessName}`);
//   //       const latestItems = res.data.business.items || [];
//   //       setItems(res.data.business.items)
//   //       const unavailableItems = cart.filter((itemInCart) => {
//   //         const correspondingItem = latestItems.find((i) => i._id === itemInCart._id);
//   //         return !correspondingItem || correspondingItem.quantity < itemInCart.quantity;
//   //       });

//   //       if (unavailableItems.length > 0) {
//   //         unavailableItems.forEach((item) => {
//   //           toast.error(`Item "${item.name}" is not available in the requested quantity.`);
//   //         });
//   //         return;
//   //       }

//   //       const orderData = cart.map((item) => ({
//   //         _id: item._id,
//   //         orderedQuantity: item.quantity,
//   //       }));

//   //       await axios.post(``, {
//   //         order: orderData,
//   //       });

//   //       toast.success("Order placed successfully!");
//   //       localStorage.setItem("cart", JSON.stringify(cart));
//   //       window.location.href = "/checkout";
//   //     } catch (err) {
//   //       toast.error(err.response?.data?.message || "Error processing order");
//   //     }
//   //   };
//   const handleBuyNow = async () => {
//     try {
//       const res = await axios.post(`http://localhost:2500/ab/cd/business/people/place_order/${businessName}`, { cart });
//       const { reservedItems, unavailableItems } = res.data;

//       if (unavailableItems.length > 0) {
//         unavailableItems.forEach((item) => {
//           toast.error(`Item "${item.name}" is out of stock or insufficient.`);
//         });
//         return;
//       }

//       // All items reserved, proceed to checkout
//       localStorage.setItem("cart", JSON.stringify(reservedItems));
//       window.location.href = "/checkout";
//     } catch (err) {
//       toast.error("Server error during reservation.");
//     }
//   };

//   if (error) return <div className="publicpage_error">{error}</div>;
//   if (!business) return <div className="publicpage_loading">Loading business data...</div>;

//   return (
//     <div className="publicpage_container">
//       <ToastContainer />
//       <div className="publicpage_welcome">
//         <h1>Welcome to {business.Businessname}!</h1>
//         <p>We're glad to have you here. Browse through our products and enjoy shopping!</p>
//         {business.description && <p><strong>About Us:</strong> {business.description}</p>}
//         {business.Name && <p><strong>Owner:</strong> {business.Name}</p>}
//         {business.location && <p><strong>Location:</strong> {business.location}</p>}
//       </div>

//       <h2 className="publicpage_title">{business.Businessname}</h2>

//       <div className="publicpage_itemsGrid">
//         {items.map((item) => (
//           <div key={item._id} className="publicpage_itemCard">
//             <img
//               src={item.image || "https://via.placeholder.com/150"}
//               alt={item.name}
//               className="publicpage_itemImage"
//             />
//             <h3>{item.name}</h3>
//             <p>₹{item.price}</p>
//             <p style={{ fontSize: "12px", color: "gray" }}>
//               In stock: {item.quantity ?? "N/A"}
//             </p>
//             <button
//               className="publicpage_addButton"
//               onClick={() => addToCart(item)}
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>

//       <h3 className="publicpage_cartTitle">Your Cart</h3>
//       {cart.length === 0 ? (
//         <p className="publicpage_emptyCart">Your cart is empty</p>
//       ) : (
//         <ul className="publicpage_cartList">
//           {cart.map((item) => (
//             <li key={item._id} className="publicpage_cartItem">
//               <span>{item.name}</span> - ₹{item.price} × {" "}
//               <input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={(e) =>
//                   updateQuantity(item._id, parseInt(e.target.value))
//                 }
//                 className="publicpage_quantityInput"
//               />
//               <button
//                 onClick={() => removeFromCart(item._id)}
//                 className="publicpage_removeBtn"
//               >
//                 Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {cart.length > 0 && (
//         <div className="publicpage_billSection">
//           <h4 className="publicpage_totalText">
//             Total: ₹
//             {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
//           </h4>
//           <button className="publicpage_buyButton" onClick={handleBuyNow}>
//             Buy Now
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicBusinessPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://vendoor-backend.onrender.com";

const PublicBusinessPage = () => {
  const { businessName } = useParams();
  const [business, setBusiness] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessName) return;

    const fetchBusinessData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/ab/cd/business/people/${businessName}`);
        setBusiness(res.data.business);
        setItems(res.data.business.items || []);
      } catch (err) {
        console.error(err);
        setError("Business not found or server error.");
      }
    };
    fetchBusinessData();
  }, [businessName]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      setCart((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        { ...item, quantity: 1, businessName: business?.Businessname || "" }
      ]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1 || isNaN(qty)) return;
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: qty } : i))
    );
  };

  const handleBuyNow = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/ab/cd/business/people/place_order/${businessName}`, { cart });
      const { reservedItems, unavailableItems } = res.data;

      if (unavailableItems.length > 0) {
        unavailableItems.forEach((item) => {
          toast.error(`Item "${item.name}" is out of stock or insufficient.`);
        });
        return;
      }

      // ✅ Attach businessName back to each reserved item
      const cartWithBusinessName = reservedItems.map((item) => ({
        ...item,
        businessName, // Ensure this is passed to Checkout
      }));

      localStorage.setItem("cart", JSON.stringify(cartWithBusinessName));
      window.location.href = "/checkout";
    } catch (err) {
      toast.error("Server error during reservation.");
    }
  };

  if (error) return <div className="publicpage_error">{error}</div>;
  if (!business) return <div className="publicpage_loading">Loading business data...</div>;

  return (
    <div className="publicpage_container">
      <ToastContainer />
      <div className="publicpage_welcome">
        <h1>Welcome to {business.Businessname}!</h1>
        <p>We're glad to have you here. Browse through our products and enjoy shopping!</p>
        {business.description && <p><strong>About Us:</strong> {business.description}</p>}
        {business.Name && <p><strong>Owner:</strong> {business.Name}</p>}
        {business.location && <p><strong>Location:</strong> {business.location}</p>}
      </div>

      <h2 className="publicpage_title">{business.Businessname}</h2>

      <div className="publicpage_itemsGrid">
        {items.map((item) => (
          <div key={item._id} className="publicpage_itemCard">
            <img
              src={item.image || "https://via.placeholder.com/150"}
              alt={item.name}
              className="publicpage_itemImage"
            />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <p style={{ fontSize: "12px", color: "gray" }}>
              In stock: {item.quantity ?? "N/A"}
            </p>
            <button
              className="publicpage_addButton"
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h3 className="publicpage_cartTitle">Your Cart</h3>
      {cart.length === 0 ? (
        <p className="publicpage_emptyCart">Your cart is empty</p>
      ) : (
        <ul className="publicpage_cartList">
          {cart.map((item) => (
            <li key={item._id} className="publicpage_cartItem">
              <span>{item.name}</span> - ₹{item.price} × {" "}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, parseInt(e.target.value))
                }
                className="publicpage_quantityInput"
              />
              <button
                onClick={() => removeFromCart(item._id)}
                className="publicpage_removeBtn"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="publicpage_billSection">
          <h4 className="publicpage_totalText">
            Total: ₹
            {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </h4>
          <button className="publicpage_buyButton" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicBusinessPage;
