import { PlayIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const GameInfoOverlay = ({ info }) => {
  const {
    isLoading,
    isDetected,
    isColliding,
    distance,
    remainingLives,
    isGameOver,
    isStarting,
    handleRestart,
  } = info;
  let lives = [];
  for (let i = 0; i <= remainingLives; i++) {
    lives.push("💀");
  }
  return (
    <div
      className={`absolute z-30 h-screen w-screen flex items-center justify-center ${
        isColliding ? "border-[15px] border-red-500 animate-screenShake" : ""
      }`}
    >
      {(isStarting || isLoading) && (
        <div className="flex flex-col items-center text-3xl font-extrabold text-slate-300 animate-bounce">
          <Image
            src={"/Intro.png"}
            width={500}
            height={500}
            alt="Intro"
            className="mb-4"
          />
          <div className="bg-slate-800 bg-opacity-75 p-4 rounded-lg shadow-lg">
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="text-center">Raise Hands to Start</div>
            )}
          </div>
        </div>
      )}

      {!isLoading && !isDetected && !isGameOver && !isStarting && (
        <div className="text-2xl font-extrabold text-slate-300 opacity-90 animate-ping font-mono">
          P A U S E D
        </div>
      )}
      {isGameOver && (
        <div className="flex flex-col items-center text-slate-300">
          <div className="text-5xl font-extrabold opacity-90 animate-ping mb-4">
            GAME OVER
          </div>
          <button
            onClick={handleRestart}
            className="bg-red-500 text-white rounded-full flex items-center hover:bg-red-700 transition duration-300"
          >
            <PlayIcon className="w-8 h-8 mx-3 my-3" />
          </button>
        </div>
      )}
      <div className="fixed top-6 right-2 text-slate-300">
        <Image src={"/Car-digital.png"} width={200} height={200} alt="Car" />
        <div className="pl-16 font-extrabold font-mono">{distance} miles</div>
      </div>
      <div className="absolute flex flex-row gap-1 top-5 left-1/2 transform -translate-x-1/2">
        {lives}
      </div>
    </div>
  );
};

export default GameInfoOverlay;
