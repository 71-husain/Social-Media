"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaGoogle, FaPlayCircle } from "react-icons/fa";
import toast from 'react-hot-toast';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("")
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true)
    try {
      const result = await signIn(
        "credentials",
        {
          email,
          password,
          callbackUrl: callbackUrl,
          redirect: false
        }
      );

      if (result?.error) {
        setError(result.error);
        setLoading(false)
      } else {
        router.push("/");
      }

    } catch (error:any) {
        toast.error(error.message || "Error in SignIn");
      setError("Something went wrong. Please try again.");
    }
  }
  return (
    <div className="grid col-1 min-h-screen bg-gray-900">
      <div className="bg-blue-700 flex flex-col items-center justify-around  space-y-6">
        <div className="flex flex-col items-center justify-center pt-10 pb-4">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <FaPlayCircle size={40} className="text-blue-600" />
          </div>
          <h1 className="text-white text-3xl font-extrabold tracking-widest mt-2 font-mono">
            ReelsPro
          </h1>
        </div>

        <button
          className="bg-white px-6 py-3 text-black rounded-md flex items-center gap-4 text-lg shadow hover:bg-gray-100 transition"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FaGoogle size={20} />
          <span>SignIn with Google</span>
        </button>
        <p className="text-white text-2xl font-semibold">OR</p>
      </div>

      <form
        className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
        onSubmit={handleLogin}
      >
        <h2 className="text-white text-xl font-bold text-center">SignIn</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "SignIn..." : "SignIn"}
        </button>
        <p className="text-white text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  )
}

export default Login