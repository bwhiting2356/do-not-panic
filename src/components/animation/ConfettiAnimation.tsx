import React, { useState, useEffect } from "react";

import Lottie from "react-lottie";
import { generateRandomConfetti } from "./helpers";

interface Props {
  play: boolean;
}

export function ConfettiAnimation({ play }: Props) {
  
  const [confetti, setConfetti] = useState(() => generateRandomConfetti());

  useEffect(() => {
    setConfetti(generateRandomConfetti())
  }, [play]);
  
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
