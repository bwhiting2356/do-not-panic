import React, { useState, useEffect } from "react";

import Lottie from "react-lottie";
import { useAppContext } from "../../context/context";
import { generateRandomConfetti } from "./helpers";


export function ConfettiAnimation() {
  const { showAnimation, setShowAnimation } = useAppContext()
  
  const [confetti, setConfetti] = useState(() => generateRandomConfetti());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showAnimation) {
      timeout = setTimeout(() => {
        setShowAnimation(false)
      }, 1500);
    }
    setConfetti(generateRandomConfetti())
    return () => clearTimeout(timeout);
    
  }, [showAnimation, setConfetti, setShowAnimation]);
  
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: (confetti as any).default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (showAnimation) {
    return (
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: 0,
          left: 0,
        }}
      >
          <div>
          <Lottie
          options={defaultOptions}
          height={600}
          width={1300}
          isPaused={false}
          isStopped={false}
        />

          </div>
        
      </div>
    );
  }
  return null;
}
