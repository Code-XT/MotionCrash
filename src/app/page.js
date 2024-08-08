"use client";
import HandRecognizer from "@/components/HandRecognizer";
import CarComponent from "@/components/CarComponent";
import { useEffect, useRef, useState } from "react";
import ObstacleComponent from "@/components/ObstacleComponent";
import GameInfoOverlay from "@/components/GameInfoOverlay";
import { playBG, playFX } from "@/utils/audioHandler";

export default function Home() {
  let generations;
  let removal;
  let distanceInterval;

  const [carLeft, setCarLeft] = useState(0);
  const [isDetected, setIsDetected] = useState(false);
  const [degree, setDegree] = useState(0);
  const [obstacle, setObstacle] = useState([]);
  const carRef = useRef(null);
  const [car, setCar] = useState();
  const [detectCollisionTrigger, setDetectCollisionTrigger] = useState(0);
  const [isInvinsible, setIsInvinsible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [remainingLives, setRemainingLives] = useState(4);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    setCarLeft(window.innerWidth / 2);
  }, []);

  useEffect(() => {
    if (isDetected && !isGameOver) {
      generations = setInterval(() => {
        setObstacle((prevArray) => {
          let retArr = [...prevArray];
          for (let i = 0; i < 4; i++) {
            const now = Date.now();
            retArr = [
              ...retArr,
              {
                timestamp: now,
                key: `${now}-${Math.random()}`,
              },
            ];
          }
          return retArr;
        });
      }, 1000);

      removal = setInterval(() => {
        const now = Date.now();
        setObstacle((prevArray) => {
          return prevArray.filter((o, idx) => {
            return now - o.timestamp < 5000;
          });
        });
      }, 5000);
    }

    return () => {
      clearInterval(generations);
      clearInterval(removal);
    };
  }, [isDetected, isGameOver]);

  useEffect(() => {
    if (isDetected && !isGameOver) {
      distanceInterval = setInterval(() => {
        setDistance((prev) => prev + 1);
      }, 100);
      setIsStarting(false);
    }

    return () => {
      clearInterval(distanceInterval);
    };
  }, [isDetected, isGameOver]);

  const setHandResult = (result) => {
    setIsLoading(result.isLoading);
    setIsDetected(result.isDetected);
    setDegree(result.degrees);

    if (result.degrees && !isNaN(result.degrees) && result.degrees !== 0) {
      setDetectCollisionTrigger(Math.random());
      setCarLeft((prev) => {
        const newLeft = prev - result.degrees / 6;
        if (newLeft < 100 || newLeft > window.innerWidth - 152) return prev;
        return newLeft;
      });
    }
    setCar(carRef.current.getBoundingClientRect());
  };

  const collisionHandler = () => {
    //post-collision logic
    if (!isInvinsible && !isGameOver) {
      console.log("Collided");
      setIsInvinsible(true);
      playFX();
      setRemainingLives((prev) => prev - 1);
      if (remainingLives <= 0) {
        setIsGameOver(true);
      }
      setTimeout(() => {
        setIsInvinsible(false);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setCarLeft(window.innerWidth / 2);
    setIsDetected(false);
    setDegree(0);
    setObstacle([]);
    setIsInvinsible(false);
    setIsLoading(false);
    setDistance(0);
    setRemainingLives(4);
    setIsGameOver(false);
    setIsStarting(true);
  };

  useEffect(() => {
    if (isDetected && !isGameOver) playBG(false);
    else playBG(true);
  }, [isDetected, isGameOver]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-24"
      style={{
        backgroundImage: "url('/highway.png')",
        backgroundSize: "cover", // or 'contain' to keep aspect ratio
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        animation: `moveBackground 1s linear infinite`,
        animationPlayState: isDetected && !isGameOver ? `running` : `paused`,
      }}
    >
      <div
        className={`absolute top-3 left-5 z-30 transition-all duration-500 ${
          isDetected ? `w-24` : `w-48`
        }`}
      >
        <HandRecognizer setHandResult={setHandResult} />
      </div>
      <div
        ref={carRef}
        id="car-container"
        style={{
          position: "absolute",
          left: carLeft,
          transition: "all",
          animationDuration: "10ms",
          marginTop: "500px",
        }}
      >
        <CarComponent degree={degree} />
      </div>
      <div className="absolute z-10 w-screen h-screen overflow-hidden">
        {obstacle.map((o, idx) => {
          return (
            <ObstacleComponent
              key={o.key}
              isMoving={isDetected}
              what={car}
              soWhat={collisionHandler}
              when={detectCollisionTrigger}
            />
          );
        })}
      </div>
      <GameInfoOverlay
        info={{
          isLoading,
          isDetected,
          isColliding: isInvinsible,
          distance,
          remainingLives,
          isGameOver,
          isStarting,
          handleRestart,
        }}
      />
    </main>
  );
}
