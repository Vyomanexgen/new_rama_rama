import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sound file in public folder
const sirenSound = "/siren.mp3";

export default function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(sirenSound);
    audio.loop = true;
    audio.play().catch((e) => console.log("Autoplay prevented:", e));
    return () => audio.pause();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-white overflow-hidden text-center px-4">
      {/* Police lights */}
      <div className="absolute top-2 flex justify-center gap-6">
        <div className="w-5 h-5 bg-red-500 rounded-full animate-blink"></div>
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-blink delay-150"></div>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold text-red-500 mt-16">
        404 - Page Not Found
      </h1>
      <p className="text-lg md:text-xl mt-4 text-gray-700">
        Oops! Looks like someone stole this page...
      </p>

      {/* Road */}
      <div className="relative w-full max-w-xl h-36 bg-gray-800 rounded-xl mt-8 flex items-center justify-between overflow-hidden">
        {/* Police car */}
        <div className="absolute bottom-5 left-[-100px] text-4xl md:text-5xl animate-chase">
          👮‍♂️
        </div>
        {/* Thief */}
        <div className="absolute bottom-5 right-[-100px] text-4xl md:text-5xl animate-run">
          💰🏃‍♂️
        </div>
      </div>

      <p className="text-lg md:text-xl mt-6 text-gray-800">
        Don't worry, the police are on the way! 🚓
      </p>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-yellow-400 text-[#0b2b7a] font-semibold px-6 py-3 rounded-md hover:bg-yellow-500 transition-all duration-300 text-lg md:text-xl"
      >
        Back to Home
      </button>
    </div>
  );
}
