"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setOtp, setEmail } from "@/redux/slices/authSlices"; 
import { AppDispatch } from "@/redux/store";

function Input({ type, id, name, label, placeholder, autofocus, value, onChange }: any) {
  return (
    <label className="text-gray-500 block mt-3">
      {label}
      <input
        autoFocus={autofocus}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-100"
      />
    </label>
  );
}

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState({
    email: "",
  });

  const [localOtp, setLocalOtp] = useState<string | null>(null); 
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/send-otp", user);
      alert(`OTP sent to the email: ${user.email}`);

      if (response.data.otp) {
        setLocalOtp(response.data.otp); 
        dispatch(setOtp(response.data.otp)); 
        dispatch(setEmail(user.email));
        router.push("/forgot-password/otp");
      } else {
        console.error("No OTP received");
      }
    } catch (e: any) {
      console.error("Send OTP failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisabled(user.email.length === 0);
  }, [user.email]);

  function Button({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="mt-6 transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:bg-blue-900 transform hover:-translate-y-1 hover:shadow-lg"
      >
        {disabled ? "Please enter all the fields" : "Send OTP"}
      </button>
    );
  }

  return (
    <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <div className="border-t-8 rounded-sm border-blue-600 bg-white p-12 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">
          {loading && !disabled ? "Loading..." : "Forgot Password"}
        </h1>
        <form>
          <Input
            type="email"
            id="email"
            name="email"
            label="Email Address"
            placeholder="john_doe@gmail.com"
            autofocus={true}
            value={user.email}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}
