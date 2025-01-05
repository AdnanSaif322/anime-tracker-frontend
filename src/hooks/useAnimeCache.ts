export const useAnimeCache = (key: string) => {
  const getFromCache = () => {
    return localStorage.getItem(key) || ""; // Return empty string if no cache
  };

  const setToCache = (value: string) => {
    localStorage.setItem(key, value);
  };

  return { getFromCache, setToCache };
};
