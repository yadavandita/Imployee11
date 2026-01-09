import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state (first-time profile creation)
  const [form, setForm] = useState({
    fullName: "",
    department: "",
    designation: "",
    employmentType: "",
    reportingManager: "",
    birthDate: "",
    joiningDate: ""
  });

  const USER_ID = localStorage.getItem("userId"); // stored on login

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
  }, []);

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      toast.error("User not logged in");
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
          body: JSON.stringify({
            fullName,
            department,
            designation,
            employmentType,
            reportingManager,
            birthDate,
            joiningDate,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to save profile");
        return;
      }

      toast.success("Profile saved and locked successfully");
    } catch (error) {
      toast.error("Server not responding");
    }
  };


  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <Toaster />

      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Employee Profile
      </h1>

      {/* 🔒 PROFILE EXISTS → READ ONLY */}
      {profile ? (
        <div className="bg-white/10 p-6 rounded-xl space-y-3">
          <p><b>Full Name:</b> {profile.fullName}</p>
          <p><b>Department:</b> {profile.department}</p>
          <p><b>Designation:</b> {profile.designation}</p>
          <p><b>Employment Type:</b> {profile.employmentType}</p>
          <p><b>Reporting Manager:</b> {profile.reportingManager}</p>
          <p><b>Birth Date:</b> {profile.birthDate}</p>
          <p><b>Joining Date:</b> {profile.joiningDate}</p>

          <button className="mt-4 px-4 py-2 bg-yellow-500 rounded">
            Request Change (Manager Approval)
          </button>
        </div>
      ) : (
        /* 🆕 NO PROFILE → CREATE FORM */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 p-6 rounded-xl space-y-4 max-w-xl"
        >
          <p className="text-gray-300">
            Profile not created yet. Please complete your profile.
          </p>

          {Object.keys(form).map(key => (
            <input
              key={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              className="w-full px-4 py-2 bg-white/20 rounded"
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          ))}

          <button
            onClick={handleSaveProfile}
            className="w-full py-2 bg-blue-500 rounded font-semibold"
          >
            Save Profile (One-Time)
          </button>
        </motion.div>
      )}
    </div>
  );
}
