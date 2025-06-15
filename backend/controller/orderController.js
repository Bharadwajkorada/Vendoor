// // controllers/orderController.js
// import Order from "../models/Orders_Schema.js";

// export const generateOrderNumber = () => {
//   return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
// };

// export const confirmOrder = async (req, res) => {
//   try {
//     const { cart, userName, phone, address } = req.body;

//     if (!cart || cart.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const orderNumber = generateOrderNumber();
//     const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const businessName = cart[0].businessName || "Unknown";

//     const newOrder = new Order({
//       orderNumber,
//       businessName,
//       userName,
//       phone,
//       address,
//       items: cart.map((item) => ({
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image,
//         itemId: item._id,
//       })),
//       totalAmount,
//     });

//     await newOrder.save();

//     res.status(201).json({ message: "Order confirmed", orderNumber });
//   } catch (error) {
//     console.error("Order confirmation failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import Order from "../models/Orders_Schema.js";

export const generateOrderNumber = () => {
  return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

export const confirmOrder = async (req, res) => {
  try {
    const { cart, userName, phone, address, transactionId } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderNumber = generateOrderNumber();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const businessName = cart[0].businessName || "Unknown";

    const newOrder = new Order({
      orderNumber,
      businessName,
      userName,
      phone,
      address,
      transactionId, // ✅ added
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        itemId: item._id,
      })),
      totalAmount,
      // status defaults to "pending", no need to set manually
    });

    await newOrder.save();

    res.status(201).json({ message: "Order confirmed", orderNumber });
  } catch (error) {
    console.error("Order confirmation failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getOrdersByBusinessName = async (req, res) => {
  try {
    const { businessName } = req.params;

    const orders = await Order.find({ businessName }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders for business:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const markOrderAsDispatched = async (req, res) => {
  const { orderId } = req.params;
  const { dispatched } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { dispatched },
      { new: true }
    );
    res.status(200).json({ message: "Order dispatch status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error dispatching order:", error);
    res.status(500).json({ error: "Failed to mark order as dispatched" });
  }
};



// export const getSalesDashboard = async (req, res) => {
//   const { businessName } = req.params;

//   try {
//     const match = { businessName, status: "Accepted" };

//     const monthlySales = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
//           total: { $sum: "$totalAmount" },
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     const yearlySales = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: { year: { $year: "$createdAt" } },
//           total: { $sum: "$totalAmount" },
//         }
//       },
//       { $sort: { "_id.year": 1 } }
//     ]);

//     const itemSales = await Order.aggregate([
//       { $match: match },
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: "$items.itemId",
//           name: { $first: "$items.name" },
//           totalQty: { $sum: "$items.quantity" },
//           totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
//         }
//       },
//       { $sort: { totalRevenue: -1 } }
//     ]);

//     res.json({ monthlySales, yearlySales, itemSales });
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ error: "Dashboard aggregation failed" });
//   }
// };

export const getSalesDashboard = async (req, res) => {
  const { businessName } = req.params;

  try {
    const match = { businessName, status: "Accepted" };

    const monthlySales = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const yearlySales = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);

    const itemSales = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ monthlySales, yearlySales, itemSales });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard aggregation failed" });
  }
};
