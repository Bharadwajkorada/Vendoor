// GET /ab/cd/business/:id
import Businessman from "../models/Businessman_Schema.js";

export const getBusinessById = async (req, res) => {
  console.log("flag1")
  try {
    const { id } = req.params;
    const business = await Businessman.findById(id).select("-Password");
    if (!business) {
      console.log("flag2")
      return res.status(404).json({ message: "Business not found" });
    }
    res.status(200).json({ business });
  } catch (error) {
    console.log("flag3")
    res.status(500).json({ message: "Server error" });
  }
};

