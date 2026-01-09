import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6 tracking-wide">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <label className="block font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Password */}
          <label className="block font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
              title="Min 8 chars, 1 uppercase, 1 number & 1 special character"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Show/Hide Toggle */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold py-3 rounded-lg shadow-md"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="border-t flex-1" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="border-t flex-1" />
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg font-medium hover:bg-gray-100 transition-all">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            className="h-6"
            alt="Google"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
