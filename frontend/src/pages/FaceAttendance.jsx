import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { MapPin, Camera, CheckCircle } from "lucide-react";

const OFFICE_LOCATION = {
  lat: 19.183925,
  lng: 72.837345
};

const ALLOWED_RADIUS = 8000;

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
  const [loading, setLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setCameraOn(true);
        toast.success("Camera ready!");
      })
      .catch(() => toast.error("Camera access denied"));

    // Get location on load
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const distance = getDistanceInMeters(
          OFFICE_LOCATION.lat,
          OFFICE_LOCATION.lng,
          latitude,
          longitude
        );
        setLocationInfo({ latitude, longitude, distance: Math.round(distance) });
      },
      () => toast.error("Location permission required")
    );
  }, []);

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

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const distance = getDistanceInMeters(
          OFFICE_LOCATION.lat,
          OFFICE_LOCATION.lng,
          latitude,
          longitude
        );

        if (distance > ALLOWED_RADIUS) {
          toast.error(`You are ${Math.round(distance)}m away from office!`);
          setLoading(false);
          return;
        }

        const faceImage = captureImage();
        const user = JSON.parse(localStorage.getItem('user'));

        try {
          const res = await fetch("http://localhost:5000/api/attendance/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?._id || "678d1234567890abcdef1234",
              latitude,
              longitude,
              faceImage
            })
          });

          const data = await res.json();

          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Failed to mark attendance");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Location permission required");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <Camera className="text-blue-400" />
          Attendance Verification
        </h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-xl w-full mb-4 border-2 border-white/20"
        />

        {locationInfo && (
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-green-400" size={18} />
              <span className="text-sm font-semibold">Location Status</span>
            </div>
            <p className="text-xs text-gray-300">
              Distance from office: <strong className={locationInfo.distance > ALLOWED_RADIUS ? 'text-red-400' : 'text-green-400'}>{locationInfo.distance}m</strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Allowed radius: {ALLOWED_RADIUS}m
            </p>
          </div>
        )}

        <p className="text-sm text-gray-300 text-center mb-4">
          Align your face properly and mark attendance
        </p>

        <button
          onClick={handleAttendance}
          disabled={!cameraOn || loading}
          className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Marking...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Mark Attendance
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}