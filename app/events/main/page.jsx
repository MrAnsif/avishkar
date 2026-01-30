'use client'
import ShinyText from "@/components/ShinyText";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <ShinyText
        text="COMING SOON"
        speed={2}
        shineColor="#ffffff"
        color="#bbbbbb"
        spread={140}
        className="text-5xl md:text-7xl font-bold tracking-wide"
      />

      <p className="mt-6 text-center text-gray-400 text-lg md:text-xl">
        We're building something amazing. Stay tuned.
      </p>

      <div className="mt-12 w-10 h-[2px] bg-gray-700 animate-pulse" />
    </div>
  );
};

export default ComingSoon;
