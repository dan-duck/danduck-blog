'use client';

import { useMemo } from 'react';

interface DateFormatterProps {
  date: string;
  format?: 'full' | 'short' | 'relative';
  className?: string;
}

export default function DateFormatter({ 
  date, 
  format = 'full',
  className = '' 
}: DateFormatterProps) {
  const formattedDate = useMemo(() => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    switch (format) {
      case 'relative':
        if (diffInDays === 0) {
          const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
          if (diffInHours === 0) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            if (diffInMinutes === 0) {
              return '방금 전';
            }
            return `${diffInMinutes}분 전`;
          }
          return `${diffInHours}시간 전`;
        } else if (diffInDays === 1) {
          return '어제';
        } else if (diffInDays < 7) {
          return `${diffInDays}일 전`;
        } else if (diffInDays < 30) {
          const weeks = Math.floor(diffInDays / 7);
          return `${weeks}주 전`;
        } else if (diffInDays < 365) {
          const months = Math.floor(diffInDays / 30);
          return `${months}개월 전`;
        } else {
          const years = Math.floor(diffInDays / 365);
          return `${years}년 전`;
        }
        
      case 'short':
        return dateObj.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        
      case 'full':
      default:
        return dateObj.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        });
    }
  }, [date, format]);
  
  const isoDate = useMemo(() => {
    return new Date(date).toISOString();
  }, [date]);
  
  const machineDate = useMemo(() => {
    const dateObj = new Date(date);
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  }, [date]);
  
  return (
    <time 
      dateTime={isoDate}
      className={`text-text-secondary font-mono text-sm ${className}`}
      title={new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })}
    >
      <span className="text-dim">[</span>
      {format === 'relative' ? formattedDate : machineDate}
      <span className="text-dim">]</span>
    </time>
  );
}