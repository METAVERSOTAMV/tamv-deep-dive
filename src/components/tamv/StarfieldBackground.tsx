import { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const starCount = 2000;
    
    // Clear existing stars
    container.innerHTML = '';

    // Create stars with varying sizes and animation durations
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Varying sizes (1-3px)
      const size = Math.random() * 2 + 1;
      
      // Random animation duration (2-8 seconds)
      const duration = Math.random() * 6 + 2;
      
      // Random animation delay
      const delay = Math.random() * 8;
      
      // Different brightness levels
      const brightness = Math.random() * 0.8 + 0.2;
      
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;
      star.style.opacity = `${brightness}`;
      
      // Add color variations (mostly white, some blue/cyan)
      if (Math.random() > 0.95) {
        star.style.background = 'hsl(180, 100%, 70%)';
        star.style.boxShadow = '0 0 4px hsl(180, 100%, 70%)';
      } else if (Math.random() > 0.9) {
        star.style.background = 'hsl(217, 91%, 70%)';
        star.style.boxShadow = '0 0 3px hsl(217, 91%, 70%)';
      }
      
      container.appendChild(star);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="starfield"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default StarfieldBackground;
