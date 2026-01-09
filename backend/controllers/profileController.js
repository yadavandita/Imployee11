import Profile from "../models/ProfileModel.js";

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
      birthDate: req.body.birthDate,
      joiningDate: req.body.joiningDate,
      locked: true,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
