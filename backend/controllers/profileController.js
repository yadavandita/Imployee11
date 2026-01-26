import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";

export const createProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already created and locked",
      });
    }

    const profile = new Profile({
      userId,
      fullName: req.body.fullName,
      department: req.body.department,
      designation: req.body.designation,
      employmentType: req.body.employmentType,
      reportingManager: req.body.reportingManager,
      role: req.body.role || 'EMPLOYEE',
      status: req.body.status || 'pending',
      birthDate: req.body.birthDate,
      joiningDate: req.body.joiningDate,
      locked: req.body.locked !== undefined ? req.body.locked : true,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: profile
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // ✅ FETCH USER EMAIL
    const user = await User.findById(req.params.userId).select("email name");
    
    // ✅ COMBINE PROFILE + EMAIL
    const profileWithEmail = {
      ...profile.toObject(),
      email: user ? user.email : "N/A"
    };

    res.json({ profile: profileWithEmail });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};