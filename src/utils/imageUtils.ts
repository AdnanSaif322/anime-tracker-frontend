export const optimizeImageUrl = (url: string, width: number) => {
  // Add width parameter for responsive images
  return `${url}?w=${width}&q=75`;
};

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};
