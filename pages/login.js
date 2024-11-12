import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      if (response.status === 201) {
        Cookie.set("access_token", response.data.access_token, { expires: 7 });

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back.",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Username or password not found.");

        Swal.fire({
          icon: "error",
          title: "Login Failed!",
          text: "Username or password not found.",
        });
      } else {
        setError("Login failed. Please try again.");

        Swal.fire({
          icon: "error",
          title: "Login Failed!",
          text: "An error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}{" "}
        {/* Tampilkan pesan error */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
