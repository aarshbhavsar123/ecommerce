"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";
import { AppWrapper } from "@/context";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Provider store = {store}>
          <AppWrapper>
                <Header />
                <main className="flex-grow bg-gray-100">{children}</main>
                <Footer />
            </AppWrapper>
        </Provider>
          
        
        
      </body>
    </html>
  );
}
