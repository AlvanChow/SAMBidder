export function simulateApiCall<T>(data: T, delayMs: number = 1500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

export function simulateUpload(
  onProgress: (progress: number) => void,
  durationMs: number = 3000
): Promise<void> {
  return new Promise((resolve) => {
    const steps = 20;
    const interval = durationMs / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = Math.min((current / steps) * 100, 100);
      onProgress(progress);

      if (current >= steps) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
}
