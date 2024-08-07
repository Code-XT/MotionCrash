"use client";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import React, { useEffect, useRef } from "react";

let detectionInterval;
const HandRecognizer = ({ setHandResult }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    initVideoAndModel();

    return () => {
      clearInterval(detectionInterval);
    };
  }, []);

  const initVideoAndModel = async () => {
    setHandResult({ isLoading: true });

    const videoElement = videoRef.current;
    if (!videoElement) return;

    await initVideo(videoElement);
    const handLandmarker = await initModel();

    detectionInterval = setInterval(() => {
      if (
        videoElement.readyState === 4 &&
        videoElement.videoWidth > 0 &&
        videoElement.videoHeight > 0
      ) {
        const detections = handLandmarker.detectForVideo(
          videoElement,
          Date.now()
        );
        processDetections(detections, setHandResult);
      }
    }, 1000 / 30);

    setHandResult({ isLoading: false });
  };

  return (
    <div>
      <video
        className="-scale-x-1 border-4 border-stone-800 rounded-lg"
        ref={videoRef}
      ></video>
    </div>
  );
};

export default HandRecognizer;

async function initVideo(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
  videoElement.addEventListener("loadeddata", () => {
    videoElement.play();
  });
}

async function initModel() {
  const wasm = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  const handLandmarker = await HandLandmarker.createFromOptions(wasm, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    numHands: 2,
    runningMode: "LIVE_STREAM",
  });
  return handLandmarker;
}

function processDetections(detections, setHandResult) {
  if (detections && detections.handedness.length > 1) {
    const rightIndex =
      detections.handedness[0][0].categoryName === "Right" ? 0 : 1;
    const leftIndex = rightIndex === 0 ? 1 : 0;

    const { x: leftX, y: leftY } = detections.landmarks[leftIndex][6];
    const { x: rightX, y: rightY } = detections.landmarks[rightIndex][6];

    const tilt = (rightY - leftY) / (rightX - leftX);
    const degrees = (Math.atan(tilt) * 180) / Math.PI;

    setHandResult({
      isDetected: true,
      tilt,
      degrees,
    });
  } else {
    setHandResult({
      isDetected: false,
      tilt: 0,
      degrees: 0,
    });
  }
}
