// // models/Order.js
// import mongoose from "mongoose";

// const OrderItemSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   quantity: Number,
//   image: String,
//   itemId: String,
// });

// const OrderSchema = new mongoose.Schema({
//   orderNumber: { type: String, required: true, unique: true },
//   businessName: { type: String, required: true },
//   userName: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   items: [OrderItemSchema],
//   totalAmount: Number,
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Order", OrderSchema);

import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  itemId: String,
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  userName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  transactionId: { type: String, required: true }, // ✅ new field
  items: [OrderItemSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }, // ✅ new field to track seller decision
  dispatched: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
