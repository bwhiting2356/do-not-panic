import React, { useState, useEffect } from "react";

import Lottie from "react-lottie";
import { useAppContext } from "../../context/context";
import { generateRandomConfetti } from "./helpers";

interface Props {
  play: boolean;
}

export function ConfettiAnimation({ play }: Props) {
  const { setShowAnimation } = useAppContext()
  
  const [confetti, setConfetti] = useState(() => generateRandomConfetti());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (play) {
      timeout = setTimeout(() => {
        setShowAnimation(false)
      }, 1500);
    }
    setConfetti(generateRandomConfetti())
    return () => clearTimeout(timeout);
    
  }, [play, setConfetti, setShowAnimation]);
  
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: (confetti as any).default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (play) {
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
