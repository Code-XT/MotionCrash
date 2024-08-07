import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ObstacleComponent = ({ isMoving, what, soWhat, when }) => {
  const [xState, setXState] = useState(0);
  const [yState, setYState] = useState(0);
  const [randomImage, setRandomImage] = useState("/barrier.png");
  const obstacleRef = useRef(null);

  useEffect(() => {
    detectCollision();
  }, [when]);
  const obstacles = [
    "/red_barrier.png",
    "/tank1_4.png",
    "/barrier.png",
    "/pngwing.png",
  ];

  const detectCollision = () => {
    if (obstacleRef.current) {
      const obstacle = obstacleRef.current.getBoundingClientRect();
      const didCollide =
        obstacle.left + 50 < what.right &&
        obstacle.right - 50 > what.left &&
        obstacle.top + 50 < what.bottom &&
        obstacle.bottom - 50 > what.top;

      if (didCollide) soWhat();
    }
  };

  useEffect(() => {
    const roadStartX = 100;
    const roadEndX = window.innerWidth - 150;
    const x = Math.random() * (roadEndX - roadStartX) + roadStartX;
    const y = -(Math.random() * 100) - 100;

    setXState(x);
    setYState(y);

    setRandomImage(obstacles[Math.floor(Math.random() * obstacles.length)]);
  }, []);

  return (
    <div
      ref={obstacleRef}
      style={{
        position: "absolute",
        left: xState,
        top: yState,
        animation: "moveObstacle 8s linear forwards",
        animationPlayState: isMoving ? "running" : "paused",
      }}
    >
      <Image src={randomImage} width={80} height={80} alt="" />
    </div>
  );
};

export default ObstacleComponent;
