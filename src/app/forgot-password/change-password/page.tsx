"use client";

import React, { useEffect } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 
function Input({ type, id, name, label, placeholder, autofocus, value, onChange }: any) {
    return (
      <label className="text-gray-500 block mt-3">{label}
        <input
          autoFocus={autofocus}
          type={type} 
          id={id} 
          name={name} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-100"/>
      </label>
    );
}

export default function ChangePasswordForm() {
    const router = useRouter();
    const email = useSelector((state:RootState)=>state.auth.email);
    const [state, setState] = React.useState({
      password:"",
      confirmPassword:""
    });
    const [disabled, setDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({ ...state, [e.target.name]: e.target.value });
        };

    const handleSubmit = async () => {
        
        try
        {
            setLoading(true);
            if(state.password===state.confirmPassword)
            {
                try
                {
                    setLoading(true);
                    const obj = {email:email,password:state.password};
                    const response = await axios.post("/api/users/change-password",obj);
                    alert("Password changed successfully");
                    router.push("/login");
                }
                catch(e)
                {
                  setLoading(false);
                  console.log("Change Password Failed");
                }
            }
            else
            {
              alert("Password and confirm password must match")
            }
        }
        catch(e)
        {
          console.log(e);
        }
    };

    useEffect(() => {
        if (state.password.length > 0 && state.confirmPassword.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [state]);

    function Button({ onClick }: { onClick: () => void }) {
        return (
            <button 
                onClick={onClick} 
                className="mt-6 transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:bg-blue-900 transform hover:-translate-y-1 hover:shadow-lg"
            >
                {disabled ? "Please Enter all the fields" : "Update"}
            </button>
        );
    }

    return (
        <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-blue-600 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl">{loading && !disabled ? "Loading..." : "Change Password"}</h1>
                <form>
                    <Input type="password" id="password" name="password" label="Password" autofocus={true} value={state.password} onChange={handleChange} />
                    <Input type="password" id="confirmPassword" name="confirmPassword" label="Confirm Password" autofocus={false} value={state.confirmPassword} onChange={handleChange} />
                    <Button onClick={handleSubmit} />
                    
                </form>
            </div>
        </div>
    );
}
