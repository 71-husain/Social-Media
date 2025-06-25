"use client"
import React,{useState} from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState<string | null>("")
        const [loading, setLoading] = useState(false)
        const searchParams = useSearchParams();
        const callbackUrl = searchParams.get("callbackUrl") || "/"
    
        const router = useRouter();

        async function handleLogin(e :React.FormEvent){
            e.preventDefault();
            setError(null);
            setLoading(true)
            try {
                const result = await signIn(
                    "credentials",
                    {
                        email,
                        password,
                        callbackUrl : callbackUrl,
                        redirect : false
                    }
                );

                if(result?.error){
                    setError(result.error);
                    setLoading(false)
                } else {
                    router.push("/");
                }

            } catch (error) {
                console.error("Error in SignIn",error)
                setError("Something went wrong. Please try again.");
            }
        }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 space-y-4"
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