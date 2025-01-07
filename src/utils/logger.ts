export const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.PROD) {
      console.info(JSON.stringify({ level: "info", message, data }));
    } else {
      console.info(message, data);
    }
  },
  error: (message: string, error?: any) => {
    if (import.meta.env.PROD) {
      console.error(JSON.stringify({ level: "error", message, error }));
    } else {
      console.error(message, error);
    }
  },
};
