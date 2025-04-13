'use client'
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const router = useRouter();
const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (emailOrUsername === "" || password === "") {
        alert("Please enter Username or Password");
        return;
    }
    try {
        const response = await fetch(`${url}/auth/login`, {
            method: "POST", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Inform the server you're sending JSON
            },
            body: JSON.stringify({
                email: emailOrUsername,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to sign in");
        }

        const data = await response.json(); // Parse the JSON response
        console.log(data); // Handle the response data
        localStorage.setItem("accessToken", data.token)
        router.push("/")
    } catch (error) {
        console.error("Error during sign-in:", error);
    }
};

  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#171626] ">
      <div className="bg-[#323232] p-6 rounded shadow-md w-96 flex flex-col gap-3 items-center justify-center">
        <Image src={"/snap_logo.png"} alt="logo" height={200} width={100} />
        <span className="font-bold text-[16px]">Sign in to SnapGram</span>
        <span className="font-light text-[13px] text-gray-400">
          Welcome back! Please sign in to continue
        </span>
        <form className="w-full">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              Email address or username
            </label>
            <input
              type="text"
              id="email"
              className="mt-1 block w-full p-1 bg-[#454545] rounded-lg focus:outline-none"
              onChange={(e) => setEmailOrUsername(e.target.value)}
              value={emailOrUsername}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-1 bg-[#454545] rounded-lg focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-400 transition-all delay-200"
            onClick={(e)=>handleSignIn(e)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;