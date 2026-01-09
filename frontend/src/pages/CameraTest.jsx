import { useRef } from "react";

export default function CameraTest() {
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera error: " + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={startCamera}>Start Camera</button>
      <br /><br />
      <video ref={videoRef} autoPlay playsInline width="300" />
    </div>
  );
}
