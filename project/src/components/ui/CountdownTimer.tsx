import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, onExpire, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        onExpire?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (isExpired) {
    return (
      <div className={`text-red-400 font-bold text-xs ${className}`}>
        Offer Expired
      </div>
    );
  }

  return (
    <div className={`text-amber-300 font-bold text-xs flex ${className}`}>
      <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
        <span>{timeLeft.days}d</span>
      </div>
      <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
        <span>{timeLeft.hours}h</span>
      </div>
      <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
        <span>{timeLeft.minutes}m</span>
      </div>
      <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
        <span>{timeLeft.seconds}s</span>
      </div>
    </div>
  );
}
