import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";
import ProfileChangeRequest from "../models/ProfileChangeRequest.js";

export const submitProfileForApproval = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { fullName, department, designation, employmentType, reportingManagerId, birthDate, joiningDate } = req.body;

    console.log("📝 Submit Profile - User ID:", userId);
    console.log("📝 Manager ID from request:", reportingManagerId);

    // Validate reportingManagerId exists and is a MANAGER/ADMIN
    const manager = await User.findById(reportingManagerId);
    console.log("📝 Manager found:", manager ? manager.name : "NOT FOUND");
    
    if (!manager || !["MANAGER", "ADMIN"].includes(manager.role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reporting manager selected"
      });
    }

    // Check if profile already approved
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile && existingProfile.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Profile already approved and locked"
      });
    }

    // Check for pending requests from this user
    const pendingRequest = await ProfileChangeRequest.findOne({
      userId,
      status: "PENDING"
    });

    if (pendingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending approval request"
      });
    }

    // Create change request
    const changeRequest = new ProfileChangeRequest({
      userId,
      requestedChanges: {
        fullName,
        department,
        designation,
        employmentType,
        reportingManagerId,
        birthDate,
        joiningDate
      },
      reportingManagerId,
      reportingManagerName: manager.name,
      reason: req.body.reason || "Initial profile submission"
    });

    const saved = await changeRequest.save();
    console.log("✅ Profile request saved:", saved._id);

    res.status(201).json({
      success: true,
      message: "Profile submitted for manager approval",
      requestId: changeRequest._id
    });
  } catch (error) {
    console.error("Profile submission error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const getManagerApprovalRequests = async (req, res) => {
  try {
    const managerId = req.userId; // From auth middleware
    const { status } = req.query;

    console.log("🔍 Manager ID:", managerId);
    console.log("🔍 User role:", req.role);

    // Only MANAGER or ADMIN can access this
    if (!['MANAGER', 'ADMIN'].includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "Only managers can view approval requests"
      });
    }

    const filter = { reportingManagerId: managerId };
    if (status) {
      filter.status = status.toUpperCase();
    }

    console.log("🔍 Filter:", filter);

    const requests = await ProfileChangeRequest.find(filter)
      .populate("userId", "email name employeeId")
      .sort({ requestedAt: -1 });

    console.log("🔍 Found requests:", requests.length);
    console.log("🔍 Requests data:", JSON.stringify(requests, null, 2));

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Fetch approval requests error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const approveProfile = async (req, res) => {
  try {
    const managerId = req.userId; // From auth middleware
    const { requestId } = req.params;

    // Only MANAGER or ADMIN can approve
    if (!['MANAGER', 'ADMIN'].includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "Only managers can approve profiles"
      });
    }

    const changeRequest = await ProfileChangeRequest.findById(requestId);
    if (!changeRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // Verify this request is for this manager
    if (changeRequest.reportingManagerId.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to approve this request"
      });
    }

    if (changeRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Cannot approve request with status: ${changeRequest.status}`
      });
    }

    // Create or update profile
    const { requestedChanges } = changeRequest;
    let profile = await Profile.findOne({ userId: changeRequest.userId });

    if (!profile) {
      profile = new Profile({
        userId: changeRequest.userId,
        fullName: requestedChanges.fullName,
        department: requestedChanges.department,
        designation: requestedChanges.designation,
        employmentType: requestedChanges.employmentType,
        reportingManager: changeRequest.reportingManagerName,
        birthDate: requestedChanges.birthDate,
        joiningDate: requestedChanges.joiningDate,
        status: "approved",
        locked: false
      });
    } else {
      profile.fullName = requestedChanges.fullName;
      profile.department = requestedChanges.department;
      profile.designation = requestedChanges.designation;
      profile.employmentType = requestedChanges.employmentType;
      profile.reportingManager = changeRequest.reportingManagerName;
      profile.birthDate = requestedChanges.birthDate;
      profile.joiningDate = requestedChanges.joiningDate;
      profile.status = "approved";
      profile.locked = false;
    }

    await profile.save();

    // Update change request
    changeRequest.status = "APPROVED";
    changeRequest.reviewedAt = new Date();
    changeRequest.reviewedBy = managerId;
    await changeRequest.save();

    res.json({
      success: true,
      message: "Profile approved successfully",
      profile
    });
  } catch (error) {
    console.error("Profile approval error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const rejectProfile = async (req, res) => {
  try {
    const managerId = req.userId; // From auth middleware
    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    // Only MANAGER or ADMIN can reject
    if (!['MANAGER', 'ADMIN'].includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "Only managers can reject profiles"
      });
    }

    const changeRequest = await ProfileChangeRequest.findById(requestId);
    if (!changeRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // Verify this request is for this manager
    if (changeRequest.reportingManagerId.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to reject this request"
      });
    }

    if (changeRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject request with status: ${changeRequest.status}`
      });
    }

    // Update change request
    changeRequest.status = "REJECTED";
    changeRequest.reviewedAt = new Date();
    changeRequest.reviewedBy = managerId;
    changeRequest.rejectionReason = rejectionReason || "Rejected by manager";
    await changeRequest.save();

    res.json({
      success: true,
      message: "Profile rejected successfully",
      rejectionReason: changeRequest.rejectionReason
    });
  } catch (error) {
    console.error("Profile rejection error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

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