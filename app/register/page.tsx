"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import User from '@/models/User';
import toast from 'react-hot-toast';


function Register() {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>("")
    const [loading, setLoading] = useState(false)

    const router = useRouter();

   async function handleRegister(e : React.FormEvent){
        e.preventDefault();
        try {
            if(password !==confirmPassword){
                setError("Password Does Not Matched")
                setLoading(false)
                return;
            }

            const res = await fetch("/api/auth/register",
                {
                    method : "POST",
                    headers : { "Content-Type": "application/json" },
                    body : JSON.stringify({username,name,email,password})
                }
            )
 
            if(res.ok) {
                console.log("User Registered Successfully");
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }

        } catch (error:any) {
        toast.error(error.message || "Error in Registration");
        } finally {
            setLoading(false);
          }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 space-y-4"
        onSubmit={handleRegister}
      >
        <h2 className="text-white text-xl font-bold text-center">Register</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}


        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-white text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register