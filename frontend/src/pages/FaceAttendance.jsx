import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

/* Office Location */
const OFFICE_LOCATION = {
  lat: 19.183925,
  lng: 72.837345
};

const ALLOWED_RADIUS = 8000;

/* Distance calc */
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function FaceAttendance() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  /* Start camera */
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setCameraOn(true);
      })
      .catch(() => toast.error("Camera access denied"));
  }, []);

  /* Capture image */
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  const handleAttendance = () => {
    if (!cameraOn) {
      toast.error("Camera not ready");
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          toast.dismiss(loadingToast);
          
          const { latitude, longitude } = pos.coords;

          const distance = getDistanceInMeters(
            OFFICE_LOCATION.lat,
            OFFICE_LOCATION.lng,
            latitude,
            longitude
          );

          // Convert to kilometers for display
          const distanceInKm = (distance / 1000).toFixed(2);

          if (distance > ALLOWED_RADIUS) {
            toast.error(`Outside office premises (${distanceInKm} km away)`);
            return;
          }

          const faceImage = captureImage();
          const userId = localStorage.getItem("userId");

          if (!userId) {
            toast.error("User session expired. Please login again.");
            return;
          }

          const res = await fetch("http://localhost:5000/api/attendance/mark", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              userId,
              latitude,
              longitude,
              faceImage
            })
          });

          const data = await res.json();

          if (!res.ok) {
            toast.error(data.message || "Attendance marking failed");
            return;
          }

          // ✅ REAL MESSAGE FROM BACKEND
          toast.success(data.message || "Attendance marked successfully!");
        } catch (error) {
          toast.error("Error marking attendance: " + error.message);
        }
      },
      (error) => {
        toast.dismiss(loadingToast);
        
        // Handle different geolocation errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Please enable location permission in your browser settings");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;
          default:
            toast.error("Unable to get your location: " + error.message);
        }
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white w-[360px]"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Attendance Verification
        </h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-xl w-full mb-4 border border-white/20"
        />

        <p className="text-sm text-gray-300 text-center mb-3">
          Align your face properly and mark attendance
        </p>

        <button
          onClick={handleAttendance}
          className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition"
        >
          Mark Attendance
        </button>
      </motion.div>
    </div>
  );
}
