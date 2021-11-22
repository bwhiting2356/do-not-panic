import * as confetti1 from "./confetti-1.json";
import * as confetti2 from "./confetti-2.json";
import * as confetti3 from "./confetti-3.json";

const allConfetti = [confetti1, confetti2, confetti3];

export const generateRandomConfetti = () => allConfetti[Math.floor(Math.random() * allConfetti.length)];