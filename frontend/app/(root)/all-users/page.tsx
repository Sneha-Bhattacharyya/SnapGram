"use client";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { UserPreview } from "@/types";
import React, { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";

const AllUsers = () => {
  const [creators, setCreators] = useState<UserPreview[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get("/user");
        // Assuming the response contains a list of creators
        setCreators((response.data as any[]).slice(0, 10));
        console.log("Creators fetched:", response.data);
      } catch (error) {
        console.error("Error fetching creators:", error);
      }
    };
    fetchCreators();
  }, []);
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {!creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((creator) => (
              <li key={creator?.id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
