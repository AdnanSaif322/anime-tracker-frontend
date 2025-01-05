import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

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
  compareTokens: (token1: string, token2: string) => {
    try {
      const decoded1 = jwtDecode<DecodedToken>(token1);
      const decoded2 = jwtDecode<DecodedToken>(token2);

      const comparison = {
        sameUser: decoded1.userId === decoded2.userId,
        sameEmail: decoded1.email === decoded2.email,
        token1IssuedAt: new Date(decoded1.iat * 1000).toISOString(),
        token2IssuedAt: new Date(decoded2.iat * 1000).toISOString(),
        token1ExpiresAt: new Date(decoded1.exp * 1000).toISOString(),
        token2ExpiresAt: new Date(decoded2.exp * 1000).toISOString(),
      };

      console.table(comparison);
      return comparison;
    } catch (error) {
      console.error("Token comparison failed:", error);
      return null;
    }
  },
};
