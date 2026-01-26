import { motion } from "framer-motion";
import { User, Briefcase, Calendar, Users, Building2, Clock, CheckCircle, Shield, Mail, Edit } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    
    setUserRole(role || "EMPLOYEE");

    if (!userId) {
      console.log("No userId found, redirecting to login");
      window.location.href = "/login";
      return;
    }

    console.log("Fetching profile for:", userId);

    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Profile data received:", data);
        
        if (!data.profile) {
          console.log("No profile found, redirecting to create profile");
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1000);
          return;
        }
        
        // Profile data now includes email from backend
        const completeProfile = {
          ...data.profile,
          role: data.profile.role || role || "EMPLOYEE",
          status: data.profile.status || "approved"
        };
        
        console.log("Complete profile with email:", completeProfile);
        setProfile(completeProfile);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading profile:", error);
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      });
  }, []);

  const getDaysUntilEdit = () => {
    if (!profile) return 30;
    const lastUpdated = new Date(profile.updatedAt || profile.createdAt);
    const now = new Date();
    const daysSince = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSince);
  };

  const canEdit = () => getDaysUntilEdit() === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
          <p className="text-gray-400 text-sm mt-2">If no profile exists, you'll be redirected to create one</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
          <p className="text-gray-400 mb-4">Redirecting you to create your profile...</p>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Profile Dashboard
          </h1>
          <p className="text-gray-400 mt-2">View and manage your professional information</p>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
        >
          <p className="text-green-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Profile Active & Locked</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl sticky top-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl font-bold shadow-2xl mb-4">
                  {profile.fullName?.charAt(0) || "U"}
                </div>
                <h2 className="text-2xl font-bold text-center">{profile.fullName}</h2>
                <p className="text-gray-400 text-center mt-1">{profile.designation}</p>
                
                {/* Role Badge */}
                <div className="mt-4">
                  {profile.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/40">
                      <Shield className="w-4 h-4" />
                      Admin / Manager
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/40">
                      <User className="w-4 h-4" />
                      Employee
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Joined {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A"}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={canEdit() ? { scale: 1.02 } : {}}
                whileTap={canEdit() ? { scale: 0.98 } : {}}
                disabled={!canEdit()}
                className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  canEdit()
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/50"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                <Edit className="w-4 h-4" />
                {canEdit() ? "Request Changes" : `Locked for ${getDaysUntilEdit()} days`}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoField label="Full Name" value={profile.fullName} />
                <InfoField label="Date of Birth" value={profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"} />
                <InfoField label="Email Address" value={profile.email} />
                <InfoField label="Employment Status" value={profile.employmentType} />
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-400" />
                Professional Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoField label="Department" value={profile.department} />
                <InfoField label="Designation" value={profile.designation} />
                <InfoField label="Joining Date" value={profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"} />
                {profile.reportingManager && (
                  <InfoField label="Reporting Manager" value={profile.reportingManager} icon={<Users className="w-4 h-4" />} />
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-400" />
                Account Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoField 
                  label="Profile Created" 
                  value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"} 
                />
                <InfoField 
                  label="Last Updated" 
                  value={profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"} 
                />
                <InfoField label="Profile Status" value={profile.locked ? "🔒 Locked" : "🔓 Unlocked"} />
                <InfoField label="Next Edit Available" value={canEdit() ? "Now" : `In ${getDaysUntilEdit()} days`} />
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-300">
                <strong>ℹ️ Profile Update Policy:</strong> Profile changes are allowed once every 30 days to maintain data integrity. 
                {profile.role === "EMPLOYEE" && " Any changes will require manager approval before becoming active."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400 flex items-center gap-1">
        {icon}
        {label}
      </label>
      <p className="text-lg font-semibold text-white">{value || "N/A"}</p>
    </div>
  );
}