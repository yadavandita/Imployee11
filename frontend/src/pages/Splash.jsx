import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/login"), 2200);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="animate-scaleIn">
        <Logo size="text-7xl" />
      </div>

      <p className="mt-4 text-sm tracking-widest opacity-60">
        THE FUTURE OF HR & PAYROLL
      </p>
    </div>
  );
}
