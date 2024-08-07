import Image from "next/image";
import React from "react";

const CarComponent = ({ degree }) => {
  return (
    <div
      style={{
        transform: `rotate(${-degree / 4}deg)`,
        transition: "all",
        animationDuration: "10ms",
      }}
    >
      <Image src={"/red_car.png"} alt="Sports Car" width={100} height={100} />
    </div>
  );
};

export default CarComponent;
