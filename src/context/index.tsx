"use client";
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import React from "react";

export const UserContext = createContext({});

export function AppWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile...");
      if (!user) {
        try {
          const { data } = await axios.get("/api/users/profile");
          setUser(data);
          console.log("User data fetched:", data); // Log the fetched data
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();

    // Cleanup: log effect cleanup to track when it gets cleared
    return () => console.log("Cleanup for user effect");
  }, [user]); // This runs every time `user` changes

  console.log("Current user:", user); // Log current user state

  return <UserContext.Provider value={{user}}>{children}</UserContext.Provider>;
}

export function useAppContext() {
  return useContext(UserContext);
}
