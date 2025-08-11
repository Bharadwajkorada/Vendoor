import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://vendoor-backend.onrender.com";

const BusinessDashboard = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "", image: "" });
  const [salesData, setSalesData] = useState({ monthlySales: [], yearlySales: [], itemSales: [] });
  const navigate = useNavigate();

  const fetchBusinessData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ab/cd/business/${businessId}`, { withCredentials: true });
      setBusiness(res.data.business);
      setItems(res.data.business.Items);
    } catch (err) {
      console.error("Error fetching business data:", err);
      navigate('/')
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ab/cd/orders/business/${business?.Businessname}`);
      setOrders(res.data.orders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchSalesDashboard = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ab/cd/orders/dashboard/${business?.Businessname}`);
      setSalesData(res.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  useEffect(() => {
    if (business?.Businessname) {
      fetchOrders();
      fetchSalesDashboard();
    }
  }, [business?.Businessname]);

  const handleInputChange = (e) => {
    setNewItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = async () => {
    const { name, price, quantity } = newItem;
    if (!name || !price || !quantity) {
      toast.error("Name, price, and quantity are required");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/ab/cd/business/${businessId}/item`,
        newItem,
        { withCredentials: true }
      );
      setItems(res.data.items);
      setNewItem({ name: "", price: "", quantity: "", image: "" });
      toast.success("Item added!");
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/ab/cd/business/${businessId}/item/${itemId}`,
        { withCredentials: true }
      );
      setItems(res.data.items);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateItem = async (itemId, updated) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/ab/cd/business/${businessId}/item/${itemId}`,
        updated,
        { withCredentials: true }
      );
      setItems(res.data.items);
      toast.success("Item updated");
    } catch {
      toast.error("Failed to update item");
    }
  };

  const updateOrder = async (orderId, status) => {
    try {
      await axios.put(`${BASE_URL}/ab/cd/orders/${orderId}/status`, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="businessdashboard_container">
      <h2 className="businessdashboard_title">Welcome, {business?.Name}</h2>
      <p className="businessdashboard_info">Business Name: {business?.Businessname}</p>
      <p className="businessdashboard_info">Email: {business?.Email}</p>

      <div className="businessdashboard_additem">
        <input name="name" placeholder="Name" value={newItem.name} onChange={handleInputChange} />
        <input name="price" type="number" placeholder="Price" value={newItem.price} onChange={handleInputChange} />
        <input name="quantity" type="number" placeholder="Quantity" value={newItem.quantity} onChange={handleInputChange} />
        <input name="image" placeholder="Image URL" value={newItem.image} onChange={handleInputChange} />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <div className="businessdashboard_items">
        {items.map(item => (
          <div key={item._id} className="businessdashboard_card">
            {item.image && <img src={item.image} alt={item.name} />}
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <div className="businessdashboard_actions">
              <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
              <button onClick={() => handleUpdateItem(item._id, { ...item, quantity: item.quantity + 1 })}>+1</button>
              <button onClick={() => handleUpdateItem(item._id, { ...item, quantity: Math.max(item.quantity - 1, 0) })}>-1</button>
            </div>
          </div>
        ))}
      </div>

      <div className="businessdashboard_orders">
        <h3>Pending Orders</h3>
        {orders.filter(o => o.status === "pending").length === 0 ? (
          <p>No pending orders.</p>
        ) : (
          orders.filter(o => o.status === "pending").map(order => (
            <div key={order._id} className="order_card">
              <p><strong>Order #:</strong> {order.orderNumber}</p>
              <p><strong>User:</strong> {order.userName}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.itemId}>
                    {item.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
              <div className="order_actions">
                <button onClick={() => updateOrder(order._id, "Accepted")}>Accept</button>
                <button onClick={() => updateOrder(order._id, "Rejected")}>Reject</button>
              </div>
            </div>
          ))
        )}

        <h3>Accepted - Ready to Dispatch</h3>
        {orders.filter(o => o.status === "Accepted" && !o.dispatched).length === 0 ? (
          <p>No ready orders to dispatch.</p>
        ) : (
          orders.filter(o => o.status === "Accepted" && !o.dispatched).map(order => (
            <div key={order._id} className="order_card">
              <p><strong>Order #:</strong> {order.orderNumber}</p>
              <p><strong>User:</strong> {order.userName}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.itemId}>
                    {item.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
              <div className="order_actions">
                <button onClick={async () => {
                  await axios.put(`${BASE_URL}/ab/cd/orders/${order._id}/dispatched`, { dispatched: true });
                  toast.success("Order marked as dispatched");
                  fetchOrders();
                }}>Mark as Dispatched</button>
              </div>
            </div>
          ))
        )}

        <h3>Dispatched Orders</h3>
        {orders.filter(o => o.status === "Accepted" && o.dispatched).length === 0 ? (
          <p>No dispatched orders yet.</p>
        ) : (
          orders.filter(o => o.status === "Accepted" && o.dispatched).map(order => (
            <div key={order._id} className="order_card">
              <p><strong>Order #:</strong> {order.orderNumber}</p>
              <p><strong>User:</strong> {order.userName}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status} — <span style={{ color: "#22c55e" }}>Dispatched</span></p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.itemId}>
                    {item.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        <h3>Rejected Orders</h3>
        {orders.filter(o => o.status === "Rejected").length === 0 ? (
          <p>No rejected orders.</p>
        ) : (
          orders.filter(o => o.status === "Rejected").map(order => (
            <div key={order._id} className="order_card">
              <p><strong>Order #:</strong> {order.orderNumber}</p>
              <p><strong>User:</strong> {order.userName}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> <span style={{ color: "#ef4444" }}>{order.status}</span></p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.itemId}>
                    {item.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="dashboard_section">
        <h2 className="section_title">📊 Sales Dashboard</h2>

        <div className="chart_container">

          <div className="chart_card">
            <h3 className="block_title">📅 Monthly Sales</h3>
            {salesData.monthlySales.length === 0 ? (
              <p className="empty_msg">No monthly sales data.</p>
            ) : (
              <Bar
                data={{
                  labels: salesData.monthlySales.map(s => `${s._id.month}/${s._id.year}`),
                  datasets: [
                    {
                      label: "Monthly Revenue",
                      data: salesData.monthlySales.map(s => s.total),
                      backgroundColor: "#22c55e",
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className="chart_card">
            <h3 className="block_title">📆 Yearly Sales</h3>
            {salesData.yearlySales.length === 0 ? (
              <p className="empty_msg">No yearly sales data.</p>
            ) : (
              <Bar
                data={{
                  labels: salesData.yearlySales.map(s => s._id.year),
                  datasets: [
                    {
                      label: "Yearly Revenue",
                      data: salesData.yearlySales.map(s => s.total),
                      backgroundColor: "#0ea5e9",
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className="chart_card">
            <h3 className="block_title">🏆 Top Selling Items</h3>
            {salesData.itemSales.length === 0 ? (
              <p className="empty_msg">No item sales data.</p>
            ) : (
              <Pie
                data={{
                  labels: salesData.itemSales.map(item => item.name || item._id),
                  datasets: [
                    {
                      label: "Revenue",
                      data: salesData.itemSales.map(item => item.totalRevenue),
                      backgroundColor: [
                        "#f87171", "#60a5fa", "#fbbf24", "#34d399", "#c084fc", "#f472b6"
                      ],
                    },
                  ],
                }}
              />
            )}
          </div>

        </div>
      </div>


    </div>
  );
};

export default BusinessDashboard;
