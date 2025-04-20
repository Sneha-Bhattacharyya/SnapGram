"use client";
import { useUser } from "@/providers/AuthProvider";
import axios from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Onboarding = () => {
  const router = useRouter();
  const userContext = useUser(); // always called
  const user = userContext?.user ?? null;
  const loading = userContext?.loading ?? true;

  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dp_url, setDpUrl] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  useEffect(() => {
    console.log("User in useEffect:", user); // 👀
  
    if (user) {
      setBio(user.bio || "");
      setName(user.name || "");
      setDpUrl(user.dp_url || "");
      setPhoneNumber(user.phone_number || "");
      setGender(user.gender || "");
    }
  }, [user]);
  
  if (loading) return <p>Loading user...</p>;
  if (!user) {
    console.log("User not found");
    return null;
  }
  function resetForm() {
    setBio("");
    setName("");
    setGender("");
    setDpUrl("");
    setPhoneNumber("");
  }
  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id } = user;
    console.log(id);
    const data = {
      name,
      bio,
      gender,
      phone_number,
      dp_url,
    };
    console.log(data);
    try {
        const res = await axios.put("/user", {
          id,
          data,
        });
        if (res.status === 200) {
          const data = await res.data;
          alert("Onboarding successful");
          router.push("/");
        } else {
          alert("Onboarding failed");
          resetForm();
        }
    } catch (error) {
      console.error("Error during onboarding:", error);
      alert("Onboarding failed");
      resetForm();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-full bg-[#171626]">
        <div className="bg-[#323232] p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4 items-center">
          <h1 className="text-white text-xl font-bold">Onboarding</h1>
          <p className="text-gray-400 text-sm text-center">
            Welcome! Please fill in your details to continue
          </p>
          <form
            onSubmit={handleOnboard}
            className="w-full flex flex-col gap-4 text-white"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2 rounded bg-[#1f1e2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio:
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="p-2 rounded bg-[#1f1e2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="gender" className="text-sm font-medium">
                Gender:
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="p-2 rounded bg-[#1f1e2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="dp_url" className="text-sm font-medium">
                Profile Picture URL:
              </label>
              <input
                type="url"
                id="dp_url"
                value={dp_url}
                onChange={(e) => setDpUrl(e.target.value)}
                className="p-2 rounded bg-[#1f1e2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone_number" className="text-sm font-medium">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone_number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="p-2 rounded bg-[#1f1e2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 rounded bg-[#6c63ff] text-white font-semibold hover:bg-[#5a54d1] transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Onboarding;