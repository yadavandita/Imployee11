import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Calendar, Users, Building2, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    department: "",
    designation: "",
    employmentType: "Full-Time",
    reportingManager: "",
    birthDate: "",
    joiningDate: ""
  });

  const USER_ID = localStorage.getItem("userId");

  const MANAGERS = ["AYUSHMAN SINGH", "PARVATI SINGH"];
  const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Intern"];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/profile/${USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setProfile(data.profile);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [USER_ID]);

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      showToast("User not logged in", "error");
      return;
    }

    // Validation
    if (!form.fullName || !form.department || !form.designation || !form.reportingManager || !form.birthDate || !form.joiningDate) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/profile/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to save profile", "error");
        return;
      }

      showToast("Profile saved successfully!");
      setProfile(form);
    } catch (error) {
      showToast("Server not responding", "error");
    }
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
      {/* Custom Toast Notification */}
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
          /* PROFILE EXISTS - READ ONLY VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                {profile.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-gray-400">{profile.designation}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard icon={<Building2 />} label="Department" value={profile.department} />
              <InfoCard icon={<Briefcase />} label="Employment Type" value={profile.employmentType} />
              <InfoCard icon={<Users />} label="Reporting Manager" value={profile.reportingManager} />
              <InfoCard icon={<Calendar />} label="Birth Date" value={new Date(profile.birthDate).toLocaleDateString()} />
              <InfoCard icon={<Clock />} label="Joining Date" value={new Date(profile.joiningDate).toLocaleDateString()} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all"
            >
              Request Profile Change (Manager Approval Required)
            </motion.button>
          </motion.div>
        ) : (
          /* NO PROFILE - CREATE FORM */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
              <p className="text-gray-400">Fill in your details to activate your account</p>
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

              <SelectField
                icon={<Users />}
                label="Reporting Manager"
                value={form.reportingManager}
                onChange={(e) => setForm({ ...form, reportingManager: e.target.value })}
                options={MANAGERS}
                placeholder="Select your manager"
              />

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
              Save Profile (One-Time Only)
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Reusable Components
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
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
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

function SelectField({ icon, label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <select
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer transition-all"
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