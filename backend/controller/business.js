import Businessman from '../models/Businessman_Schema.js';

export const addItemToBusiness = async (req, res) => {
  let { name, price, quantity, image } = req.body;
  const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrDkmiTFZHftPXs2EWuVL8prRCGp_4P7oDkg&s";

  try {
    const business = await Businessman.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    image = image || defaultImage;

    business.Items.push({ name, price, quantity, image });
    await business.save();
    res.json({ message: "Item added successfully", items: business.Items });
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
};


export const deleteItemFromBusiness = async (req, res) => {
  try {
    const business = await Businessman.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    business.Items = business.Items.filter(item => item._id.toString() !== req.params.itemId);
    await business.save();
    res.json({ message: "Item removed", items: business.Items });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

export const updateItemInBusiness = async (req, res) => {
  const { name, price, quantity, image } = req.body;
  try {
    const business = await Businessman.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    const item = business.Items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name = name ?? item.name;
    item.price = price ?? item.price;
    item.quantity = quantity ?? item.quantity;
    item.image = image ?? item.image;

    await business.save();
    res.json({ message: "Item updated", items: business.Items });
  } catch (err) {
    res.status(500).json({ message: "Failed to update item" });
  }
};




export const getBusinessItemsPublic = async (req, res) => {
  try {
    const { businessname } = req.params;
    const business = await Businessman.findOne({ Businessname: businessname });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    // Convert Map (if Items is a Map) or ensure it's an array
    const items = Array.isArray(business.Items)
      ? business.Items
      : Array.from(business.Items.values());
    // console.log("hello")
    res.json({
      business: {
        Businessname: business.Businessname,
        Name: business.Name,
        items: items
      }
    });
  } catch (err) {
    console.error("Error in getBusinessItemsPublic:", err);
    res.status(500).json({ message: 'Server error' });
  }
};



export const reserveItems = async (req, res) => {
  const { cart } = req.body;
  let unavailableItems = [];
  let reservedItems = [];

  try {
    for (const item of cart) {
      const businessman = await Businessman.findOne({ "Items._id": item._id });

      if (!businessman) {
        unavailableItems.push({ ...item, reason: "Business not found" });
        continue;
      }

      const dbItem = businessman.Items.id(item._id);

      if (!dbItem || dbItem.quantity < item.quantity) {
        unavailableItems.push({ ...item, reason: "Not enough stock" });
        continue;
      }

      dbItem.quantity -= item.quantity;
      reservedItems.push({ ...dbItem.toObject(), quantity: item.quantity });

      await businessman.save();
    }

    return res.json({ reservedItems, unavailableItems });
  } catch (err) {
    return res.status(500).json({ message: "Reservation failed", error: err });
  }
};

export const releaseItems = async (req, res) => {
  const { cart } = req.body;
  
  console.log("Received cart for release:", cart); 
  try {
    for (const item of cart) {
      const businessman = await Businessman.findOne({ "Items._id": item._id });
      if (!businessman) {
        continue;
      }
      const dbItem = businessman.Items.id(item._id);
      console.log(dbItem.quantity,item.quantity);
      if (dbItem) {
        dbItem.quantity += item.quantity;  // Return quantity
      }
      console.log(dbItem.quantity);

      await businessman.save();
    }

    return res.json({ message: "Items successfully released." });
  } catch (err) {
    console.error("Error releasing items:", err);
    return res.status(500).json({ message: "Failed to release items." });
  }
};


export const getBankDetailsByBusinessName = async (req, res) => {
  try {
    const { businessName } = req.params;
    console.log("Requested businessName:", businessName);
    const business = await Businessman.findOne(
      { Businessname: businessName },
      { BankDetails: 1, _id: 0 } // Only return BankDetails
    );
    
    if (!business) {
      console.log("hello from")
      return res.status(404).json({ message: 'Business not found' });
    }

    if (!business.BankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }

    res.json({ bankDetails: business.BankDetails });
  } catch (error) {
    console.error('Error fetching bank details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllBusinessNames = async (req, res) => {
  try {
    const businesses = await Businessman.find({}, 'Businessname');
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses" });
  }
};
