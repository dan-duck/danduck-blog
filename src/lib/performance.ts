// Performance logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

interface PerformanceMark {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceLogger {
  private marks: Map<string, PerformanceMark> = new Map();

  // Start a performance measurement
  mark(name: string): void {
    this.marks.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  // End a performance measurement
  measure(name: string): number | null {
    const mark = this.marks.get(name);
    if (!mark) {
      console.warn(`Performance mark "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - mark.startTime;
    
    mark.endTime = endTime;
    mark.duration = duration;

    if (isDevelopment) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Log all marks
  logAll(): void {
    if (!isDevelopment) return;

    console.group('[Performance] All Marks');
    this.marks.forEach((mark) => {
      if (mark.duration !== undefined) {
        console.log(`${mark.name}: ${mark.duration.toFixed(2)}ms`);
      }
    });
    console.groupEnd();
  }

  // Clear all marks
  clear(): void {
    this.marks.clear();
  }
}

// Export singleton instance
export const perfLogger = new PerformanceLogger();

// Helper functions for common measurements
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  perfLogger.mark(name);
  return fn().finally(() => {
    perfLogger.measure(name);
  });
}

export function measureSync<T>(
  name: string,
  fn: () => T
): T {
  perfLogger.mark(name);
  try {
    return fn();
  } finally {
    perfLogger.measure(name);
  }
}