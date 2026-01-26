import express from "express";
import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";

const router = express.Router();

// Get all managers
router.get("/managers", async (req, res) => {
  try {
    console.log("📞 /managers endpoint called");

    const profileManagers = await Profile.find({ 
      role: "ADMIN",
      status: "approved"
    }).select("fullName userId");
    
    console.log("✅ Found managers in profiles:", profileManagers);

    if (profileManagers && profileManagers.length > 0) {
      return res.json({
        success: true,
        managers: profileManagers.map(p => ({
          _id: p.userId,
          name: p.fullName
        }))
      });
    }

    const userManagers = await User.find({ 
      role: { $in: ["ADMIN", "MANAGER"] }
    }).select("name email _id");
    
    console.log("✅ Found managers in users collection:", userManagers);

    res.json({
      success: true,
      managers: userManagers
    });

  } catch (error) {
    console.error("❌ Error fetching managers:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to load managers",
      error: error.message
    });
  }
});

// ✅ NEW: Get user by ID to fetch email
router.get("/:userId", async (req, res) => {
  try {
    console.log("Fetching user with ID:", req.params.userId);
    
    const user = await User.findById(req.params.userId).select("name email role");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("User found:", user);

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

export default router;