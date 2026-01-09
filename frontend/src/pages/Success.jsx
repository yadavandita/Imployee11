import { useSearchParams, Link } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();
  const type = params.get("type");

  const message =
    type === "register"
      ? "🎉 Account Created Successfully!"
      : "✔ Login Successful";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500 animate-gradient text-white">
      <h1 className="text-4xl font-bold mb-4 animate-fadeUp">{message}</h1>
      <Link
        className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-bold mt-4 transition-transform hover:scale-105"
        to="/login"
      >
        Continue
      </Link>
    </div>
  );
}
