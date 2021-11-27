import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { generateRandomConfetti } from "./helpers";
import { useAppContext } from "../../context/context";
import { MILLISECONDS_PER_SECOND } from "../../shared/constants";

export function ConfettiAnimation() {
  const { showAnimation, setShowAnimation } = useAppContext();

  const [confetti, setConfetti] = useState(() => generateRandomConfetti());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showAnimation) {
      timeout = setTimeout(() => {
        setShowAnimation(false);
      }, MILLISECONDS_PER_SECOND);
    }
    setConfetti(generateRandomConfetti());
    return () => clearTimeout(timeout);
  }, [showAnimation, setConfetti, setShowAnimation]);

  const defaultOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animationData: (confetti as any).default,
    autoplay: true,
    loop: false,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (showAnimation) {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          left: 0,
          margin: "auto",
          pointerEvents: "none",
          position: "absolute",
          top: 0,
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
