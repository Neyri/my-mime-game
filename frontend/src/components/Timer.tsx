import React, { useEffect, useRef } from 'react';

interface TimerProps {
  duration: number;
  timeLeft: number;
  isActive: boolean;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, timeLeft, isActive, onTimeUp }) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(1);

  const timer = () => {
    if (!isActive) {
      cancelAnimationFrame(animationFrameRef.current!);
      return;
    }

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Calculate progress with smooth interpolation
    const progress = 1 - (timeLeft / duration);
    const progressDiff = progress - lastProgressRef.current;
    const smoothedProgress = lastProgressRef.current + progressDiff * 0.1; // Dampen the progress change
    lastProgressRef.current = smoothedProgress;

    // Only request new frame if we're still active
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(timer);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Only start timer if active
  useEffect(() => {
    if (isActive) {
      timer();
    }
  }, [isActive, onTimeUp]);

  // Calculate percentages for the progress ring
  const circumference = 2 * Math.PI * 45; // radius is 45
  const progress = 1 - (timeLeft / duration);
  const strokeDashoffset = circumference * progress;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="stroke-gray-200 fill-none"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="10"
          transform="rotate(-90 50 50)"
        />
        <circle
          className="stroke-indigo-500 fill-none transition-all duration-300 ease-in-out"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="10"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ 
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.3s ease-in-out'
          }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-700">
          {timeLeft}s
        </div>
      </div>
    </div>
  );
};

export default Timer;