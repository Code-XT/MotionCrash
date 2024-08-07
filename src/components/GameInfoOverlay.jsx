import { CarFrontIcon, Loader2 } from "lucide-react";
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
  } = info;
  let lives = [];
  for (let i = 0; i <= remainingLives; i++) {
    lives.push("💀");
  }
  return (
    <div
      className={`absolute z-30 h-screen w-screen flex items-center justify-center ${
        isColliding && `border-[15px] border-red-500`
      }`}
    >
      {isLoading && <Loader2 size={80} className="animate-spin text-white" />}
      {!isLoading && !isDetected && !isGameOver && (
        <div className="text-2xl font-extrabold text-slate-300 opacity-90 animate-ping">
          P A U S E D
        </div>
      )}
      {isGameOver && (
        <div className="text-2xl font-extrabold text-slate-300 opacity-90 animate-ping">
          GAME OVER
        </div>
      )}
      <div className="fixed top-6 right-2 text-slate-300">
        <Image src={"/Car-digital.png"} width={200} height={200} />
        <div className="pl-16 font-extrabold font-mono">{distance} miles</div>
      </div>
      <div className="absolute flex flex-row gap-1 top-5 left-1/2">{lives}</div>
    </div>
  );
};

export default GameInfoOverlay;
