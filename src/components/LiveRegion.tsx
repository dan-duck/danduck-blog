'use client';

import { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  type?: 'polite' | 'assertive';
  clearAfter?: number;
}

export default function LiveRegion({ 
  message, 
  type = 'polite',
  clearAfter = 5000 
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);
    
    if (clearAfter > 0 && message) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      role={type === 'assertive' ? 'alert' : 'status'}
      aria-live={type}
      aria-atomic="true"
      className="sr-announcement"
    >
      {currentMessage}
    </div>
  );
}