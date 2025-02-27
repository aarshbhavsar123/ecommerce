"use client";
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import React from "react";

export const UserContext = createContext<{ user: any; setUser: (user: any) => void }>({
  user: null,
  setUser: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile...");
      try {
        const { data } = await axios.get("/api/users/profile");
        setUser(data);
        console.log("User data fetched:", data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); 
      }
    };

    fetchUserProfile();
  }, []); 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAppContext() {
  return useContext(UserContext);
}
