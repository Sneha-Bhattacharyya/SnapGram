'use client'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { AuthResponse } from "@/types";
import axios from "@/utils/axiosInstance"; // Import the axios instance with interceptors

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const router = useRouter();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (username === "" || password === "" || email === "") {
      alert("Please enter Username, Email and Password");
      return;
    }
    try {
      const response = await axios.post("/auth/register", {
      username: username,
      email: email,
      password: password,
      });

      const data:AuthResponse = response.data as AuthResponse; // Extract the response data
      console.log(data); // Handle the response data
      localStorage.setItem("accessToken", data.token);
      router.push("/");
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
          Join us today! Create an account to get started
        </span>
        <form className="w-full" onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full p-1 bg-[#454545] rounded-lg focus:outline-none"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-1 bg-[#454545] rounded-lg focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full p-1 bg-[#454545] rounded-lg focus:outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-400 transition-all delay-200"
            onClick={(e) => {
              if (password !== confirmPassword) {
          e.preventDefault();
          alert("Passwords do not match");
          return;
              }
              handleSignIn(e);
            }}
          >
            Sign Up
          </button>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:underline"
              >
                Sign In
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;