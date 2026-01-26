import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Calendar, Users, Building2, Clock, CheckCircle, XCircle, Shield } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [manualUserId, setManualUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    department: "",
    designation: "",
    employmentType: "Full-Time",
    reportingManager: "",
    role: "EMPLOYEE",
    birthDate: "",
    joiningDate: ""
  });

  const getUserId = () => {
    if (manualUserId) return manualUserId;
    return localStorage.getItem("userId") || 
           localStorage.getItem("user_id") || 
           localStorage.getItem("id") ||
           sessionStorage.getItem("userId");
  };

  const USER_ID = getUserId();

  const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Intern"];
  const ROLES = ["EMPLOYEE", "ADMIN (Manager)"];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all managers (users with ADMIN role)
  const fetchManagers = async () => {
    setLoadingManagers(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/managers");
      const data = await res.json();
      
      if (data.success && data.managers) {
        setManagers(data.managers);
        console.log("Fetched managers:", data.managers);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      showToast("Failed to load managers list", "error");
    } finally {
      setLoadingManagers(false);
    }
  };

  useEffect(() => {
    console.log("=== DEBUGGING LOCALSTORAGE ===");
    console.log("USER_ID:", USER_ID);
    console.log("All localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`  ${key}:`, localStorage.getItem(key));
    }
    console.log("===========================");

    const role = localStorage.getItem("role");
    setUserRole(role);
    
    // Fetch managers list for employee role selection
    fetchManagers();
    
    if (!USER_ID) {
      setLoading(false);
      showToast("Please enter your User ID to continue", "error");
      return;
    }

    console.log("Fetching profile for userId:", USER_ID);
    
    fetch(`http://localhost:5000/api/profile/${USER_ID}`)
      .then(res => {
        console.log("Profile fetch status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("=== PROFILE FETCH RESPONSE ===");
        console.log("Full response:", data);
        console.log("Profile exists:", !!data.profile);
        console.log("=============================");
        
        if (data.profile) {
          // Profile exists! Redirect to dashboard to view it
          console.log("Profile found! Redirecting to dashboard...");
          showToast("Profile loaded! Redirecting...", "success");
          setTimeout(() => {
            window.location.href = "/profile-dashboard";
          }, 1000);
        } else {
          console.log("No profile found, showing form");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        console.log("No profile exists, showing create form");
        setLoading(false);
      });
  }, [USER_ID]);

  const handleSaveProfile = async () => {
    const userId = getUserId();
    const token = localStorage.getItem("token") || localStorage.getItem("authToken") || "dummy-token";

    console.log("=== SAVE PROFILE DEBUG ===");
    console.log("userId:", userId);
    console.log("token:", token ? "exists" : "missing");
    console.log("form data:", form);
    console.log("========================");

    if (!userId || userId === "undefined") {
      showToast("⚠️ User ID is missing! Please enter it in the yellow box above.", "error");
      return;
    }

    if (!form.fullName || !form.department || !form.designation || !form.birthDate || !form.joiningDate) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (form.role === "EMPLOYEE" && !form.reportingManager) {
      showToast("Please select your reporting manager", "error");
      return;
    }

    try {
      const profileData = {
        fullName: form.fullName,
        department: form.department,
        designation: form.designation,
        employmentType: form.employmentType,
        birthDate: form.birthDate,
        joiningDate: form.joiningDate,
        role: form.role === "ADMIN (Manager)" ? "ADMIN" : "EMPLOYEE",
        status: form.role === "ADMIN (Manager)" ? "approved" : "pending",
        reportingManager: form.role === "ADMIN (Manager)" ? null : form.reportingManager,
        locked: true // Always lock after first save
      };

      console.log("Sending profile data:", profileData);

      console.log("Sending to:", `http://localhost:5000/api/profile/create/${userId}`);
      
      const res = await fetch(
        `http://localhost:5000/api/profile/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        showToast(data.message || "Failed to save profile", "error");
        return;
      }

      console.log("✅ Profile saved successfully!");
      console.log("Form role was:", form.role);
      
      // Update user role in localStorage
      const savedRole = form.role === "ADMIN (Manager)" ? "ADMIN" : "EMPLOYEE";
      localStorage.setItem("role", savedRole);
      
      console.log("Updated localStorage role to:", savedRole);

      if (form.role === "ADMIN (Manager)") {
        showToast("Profile saved and approved automatically!", "success");
        console.log("🔄 Redirecting ADMIN to /profile-dashboard in 1.5 seconds...");
      } else {
        showToast("Profile saved! Waiting for manager approval.", "success");
        console.log("🔄 Redirecting EMPLOYEE to /profile-dashboard in 1.5 seconds...");
      }
      
      setTimeout(() => {
        console.log("NOW REDIRECTING TO: /profile-dashboard");
        window.location.href = "/profile-dashboard";
      }, 1500);
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast("Server not responding", "error");
    }
  };

  const canEditProfile = () => {
    if (!profile) return false;
    if (!profile.locked) return true; // If not locked, can edit (shouldn't happen but safety check)

    const lastUpdated = new Date(profile.updatedAt || profile.createdAt);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
    
    return daysSinceUpdate >= 30;
  };

  const getDaysUntilEdit = () => {
    if (!profile) return 0;
    const lastUpdated = new Date(profile.updatedAt || profile.createdAt);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSinceUpdate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
            toast.type === "error"
              ? "bg-red-500/90 backdrop-blur-lg"
              : "bg-green-500/90 backdrop-blur-lg"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle className="w-6 h-6" />
          ) : (
            <CheckCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{toast.message}</span>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        {!USER_ID && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500 rounded-xl p-6 mb-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-yellow-300 mb-2">⚠️ Setup Required</h3>
            <p className="text-white mb-4">User ID not found. Enter your employee ID to continue:</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your User ID (e.g., 1, 2, 3...)"
                value={manualUserId}
                onChange={(e) => setManualUserId(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={() => {
                  if (manualUserId) {
                    localStorage.setItem("userId", manualUserId);
                    showToast("User ID saved! Reloading...", "success");
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    showToast("Please enter a User ID", "error");
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Save & Continue
              </button>
            </div>
            <p className="text-sm text-gray-300 mt-3">💡 Tip: Ask your manager for your employee ID, or use any number for testing (e.g., "1")</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Employee Profile
          </h1>
          <p className="text-gray-400">Manage your professional information</p>
        </motion.div>

        {profile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            {/* Status Banner */}
            {profile.status === "pending" ? (
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-yellow-300 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>⏳ Profile pending approval from <strong>{profile.reportingManager}</strong></span>
                </p>
                <p className="text-sm text-yellow-200 mt-2">Your profile will be visible after your manager approves it.</p>
              </div>
            ) : profile.status === "approved" ? (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <p className="text-green-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>✅ Profile approved and locked permanently</span>
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                <p className="text-blue-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Profile is saved and locked</span>
                </p>
              </div>
            )}

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/20">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                {profile.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold">{profile.fullName}</h2>
                <p className="text-gray-400 text-lg mt-1">{profile.designation}</p>
                <div className="flex gap-2 mt-2">
                  {profile.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      <Shield className="w-4 h-4" /> Admin/Manager
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                      <User className="w-4 h-4" /> Employee
                    </span>
                  )}
                  {profile.status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full border border-yellow-500/30">
                      <Clock className="w-4 h-4" /> Pending Approval
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <InfoCard 
                icon={<Building2 />} 
                label="Department" 
                value={profile.department || "N/A"} 
              />
              <InfoCard 
                icon={<Briefcase />} 
                label="Employment Type" 
                value={profile.employmentType || "N/A"} 
              />
              {profile.reportingManager && (
                <InfoCard 
                  icon={<Users />} 
                  label="Reporting Manager" 
                  value={profile.reportingManager} 
                />
              )}
              <InfoCard 
                icon={<Calendar />} 
                label="Birth Date" 
                value={profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : "N/A"} 
              />
              <InfoCard 
                icon={<Clock />} 
                label="Joining Date" 
                value={profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : "N/A"} 
              />
              <InfoCard 
                icon={<Calendar />} 
                label="Profile Created" 
                value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : "N/A"} 
              />
            </div>

            {/* Edit Button - Only show if approved */}
            {profile.status === "approved" && (
              <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Profile Updates</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {canEditProfile() 
                        ? "You can now request profile changes" 
                        : `Next edit available in ${getDaysUntilEdit()} days`
                      }
                    </p>
                  </div>
                  <motion.button
                    whileHover={canEditProfile() ? { scale: 1.05 } : {}}
                    whileTap={canEditProfile() ? { scale: 0.95 } : {}}
                    disabled={!canEditProfile()}
                    onClick={() => {
                      if (canEditProfile()) {
                        // For ADMIN: directly edit
                        // For EMPLOYEE: request change
                        showToast("Edit feature coming soon!", "success");
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                      canEditProfile()
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-yellow-500/50 cursor-pointer"
                        : "bg-gray-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {canEditProfile() 
                      ? (profile.role === "ADMIN" ? "Edit Profile" : "Request Changes") 
                      : "🔒 Locked"
                    }
                  </motion.button>
                </div>
                
                {!canEditProfile() && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300">
                      ℹ️ Profile updates are restricted to once every 30 days to maintain data integrity.
                      {profile.role === "EMPLOYEE" && " Any changes will require manager approval."}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Message for Employees */}
            {profile.status === "pending" && profile.role === "EMPLOYEE" && (
              <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">⏳ Awaiting Manager Approval</h3>
                <p className="text-sm text-gray-300">
                  Your profile has been submitted to <strong>{profile.reportingManager}</strong> for approval. 
                  You will be able to view your complete profile once it's approved.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
              <p className="text-gray-400">Fill in your details to activate your account</p>
            </div>

            {/* ROLE DROPDOWN - BIG AND PROMINENT */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 rounded-xl relative">
              <label className="text-lg font-bold mb-3 text-purple-300 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Select Your Role (Important!)
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-6 py-4 bg-white/20 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-lg font-semibold cursor-pointer transition-all"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role} className="bg-gray-800 text-white py-2">
                    {role}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-300 mt-3">
                {form.role === "ADMIN (Manager)" 
                  ? "✅ As Admin, your profile will be auto-approved and you can edit it monthly."
                  : "📋 As Employee, your profile will be sent to your reporting manager for approval."
                }
              </p>
            </div>

            <div className="space-y-5">
              <InputField
                icon={<User />}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />

              <InputField
                icon={<Building2 />}
                label="Department"
                type="text"
                placeholder="e.g., Engineering, Marketing"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />

              <InputField
                icon={<Briefcase />}
                label="Designation"
                type="text"
                placeholder="e.g., Software Engineer, Manager"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />

              <SelectField
                icon={<Clock />}
                label="Employment Type"
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                options={EMPLOYMENT_TYPES}
              />

              {form.role === "EMPLOYEE" && (
                <SelectField
                  icon={<Users />}
                  label="Reporting Manager"
                  value={form.reportingManager}
                  onChange={(e) => setForm({ ...form, reportingManager: e.target.value })}
                  options={managers.map(m => m.name)}
                  placeholder={loadingManagers ? "Loading managers..." : "Select your manager"}
                  disabled={loadingManagers}
                />
              )}

              <InputField
                icon={<Calendar />}
                label="Birth Date"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              />

              <InputField
                icon={<Calendar />}
                label="Joining Date"
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveProfile}
              className="mt-8 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              {form.role === "ADMIN (Manager)" ? "Save Profile (Auto-Approved)" : "Save Profile & Request Approval"}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3 mb-2 text-blue-400">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function InputField({ icon, label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="inline-block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
        />
      </div>
    </div>
  );
}

function SelectField({ icon, label, value, onChange, options, placeholder, disabled }) {
  return (
    <div>
      <label className="inline-block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option} className="bg-gray-800">
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}