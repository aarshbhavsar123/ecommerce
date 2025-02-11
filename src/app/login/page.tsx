"use client";

import React, { useEffect } from 'react';
import axios  from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {toast} from "react-hot-toast";


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

export default function FunctionLoginForm() {
    const router = useRouter();
    const [user, setUser] = React.useState({
      
      email: "",
      password: "",
    });
    const [disabled,setDisabled] = React.useState(true);
    const [loading,setLoading] = React.useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        // Implement sign-up logic
        try
        {
            setLoading(true);
            const response = await axios.post("/api/users/login",user);
            console.log("Signup Success",response.data);
            toast.success("Login Success");
            router.push("/");
        }
        catch(e:any)
        {
            console.log("Login Failed",e.message);
            setLoading(false);
        }
        finally
        {

        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            // Handle user input changes
            setDisabled(false);
        }
        else
        {
          setDisabled(true);
        }
    }, [user]);
    function Button({ onClick }: { onClick: () => void }) {
      return (
          <button 
              onClick={onClick} 
              className="mt-6 transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:bg-blue-900 transform hover:-translate-y-1 hover:shadow-lg"
          >
              {disabled?"Please enter all the fields":"Login"}
          </button>
      );
  }
    return (
      <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
        <div className="border-t-8 rounded-sm border-blue-600 bg-white p-12 shadow-2xl w-96">
          <h1 className="font-bold text-center block text-2xl">{(loading && !disabled)?"Loading...":"Login"}</h1>
          <form>
            <Input type="email" id="email" name="email" label="Email Address" placeholder="john_doe@gmail.com" autofocus={true} value={user.email} onChange={handleChange} />
            <Input type="password" id="password" name="password" label="Password" placeholder="••••••••••" value={user.password} onChange={handleChange} />
            <Button onClick={handleSubmit} />
            <p className="text-center text-gray-600 mt-4">Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link></p>
          </form>
        </div>
      </div>
    );
}
