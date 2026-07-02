// === MINA Block Puzzle - Splash Screen ===

import React, { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0e1a 0%, #1a1040 50%, #0f0e1a 100%)' }}
    >
      {/* Background orbs */}
      <div className="absolute w-64 h-64 rounded-full bg-orb opacity-20"
        style={{
          background: 'radial-gradient(circle, #ff6b9d 0%, transparent 70%)',
          top: '15%',
          left: '10%',
          filter: 'blur(40px)',
        }}
      />
      <div className="absolute w-80 h-80 rounded-full bg-orb opacity-15"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
          bottom: '20%',
          right: '5%',
          filter: 'blur(50px)',
          animationDelay: '-3s',
        }}
      />
      <div className="absolute w-48 h-48 rounded-full bg-orb opacity-10"
        style={{
          background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(30px)',
          animationDelay: '-5s',
        }}
      />

      {/* Logo */}
      <div className="animate-scaleIn flex flex-col items-center">
        {/* Game icon */}
        <div className="w-28 h-28 mb-6 rounded-3xl flex items-center justify-center animate-float"
          style={{
            background: 'linear-gradient(135deg, #ff6b9d, #c084fc)',
            boxShadow: '0 8px 40px rgba(255, 107, 157, 0.4), 0 0 60px rgba(192, 132, 252, 0.2)',
          }}
        >
          <div className="grid grid-cols-3 gap-1.5 p-1">
            {[1,1,0,0,1,1,1,1,1].map((filled, i) => (
              <div key={i} className={`w-6 h-6 rounded-md ${
                filled
                  ? 'bg-white/90'
                  : 'bg-white/20'
              }`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: filled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-black tracking-wider shimmer-text mb-3"
          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          MINA
        </h1>
        <p className="text-lg font-medium tracking-widest uppercase"
          style={{ color: 'rgba(226, 224, 255, 0.5)' }}
        >
          Block Puzzle
        </p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-10">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: '#ff6b9d',
                animation: `float 1.5s ease-in-out ${i * 0.3}s infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
