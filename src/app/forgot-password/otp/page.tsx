"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 
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
export default function ForgotPasswordOtp() {
    const router = useRouter();
    const email = useSelector((state:RootState)=>state.auth.email);
    const [state, setState] = useState({ otp: "" ,email:email});
    const [disabled, setDisabled] = useState(true);
    const [loading,setLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
      
      
      try{
        setLoading(true);
        const res = await axios.post("/api/users/verify-otp",state);
        router.push("/forgot-password/change-password")
      }
      catch(e)
      {
        console.log(e);
      }
      finally{
        setLoading(false);
      }
        
    };

    useEffect(() => {
        setDisabled(state.otp.length === 0);
    }, [state.otp]);

    function Button({ onClick }: { onClick: () => void }) {
      return (
        <button
          onClick={onClick}
          className="mt-6 transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:bg-blue-900 transform hover:-translate-y-1 hover:shadow-lg"
        >
          {disabled ? "Please enter all the fields" : "Change Password"}
        </button>
      );
    }
    return (
        <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <div className="border-t-8 rounded-sm border-blue-600 bg-white p-12 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">
          {loading && !disabled ? "Loading..." : "Enter OTP"}
        </h1>
        <form>
          <Input
            type="password"
            id="otp"
            name="otp"
            label="OTP"
            autofocus={true}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} />
        </form>
      </div>
    </div>
    );
}
