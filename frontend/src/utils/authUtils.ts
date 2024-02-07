import type { PassportResponse, TokenInfo } from "../types/types";
// import { getAccessToken } from "../services/spotifyApi";
import { refreshToken } from "../services/spotifyApi";
import Cookies from "js-cookie";

const TOKEN_STORAGE_KEY = "tokenInfo";

export const logout = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    Cookies.remove(cookieName);
  });
};

export const tokenIsExpired = (tokenDate: number): boolean => {
  const currentDate = Date.now();
  const timeDifference = (currentDate - tokenDate) / 1000;
  if (timeDifference >= 84600) {
    logout();
  }
  return timeDifference >= 3500;
};

export const setTokenInfo = () => {
  const currentDate = Number(Cookies.get("date"));
  const accessToken = Cookies.get("accessToken");
  if (accessToken && currentDate) {
    const tokenInfo: TokenInfo = {
      accessToken,
      date: currentDate,
    };
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenInfo));
  }
};

export const getTokenInfo = (): TokenInfo | undefined => {
  try {
    const storageItem = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storageItem) {
      return JSON.parse(storageItem) as TokenInfo;
    }
  } catch (e) {
    console.error("Error retrieving tokenInfo from localstorage");
  }
  return undefined;
};

export const retrieveAccessToken = async (): Promise<
  PassportResponse | undefined
> => {
  let tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    setTokenInfo();
  }

  if (tokenInfo) {
    const { date } = tokenInfo;

    if (date) {
      const isExpired = tokenIsExpired(date);
      if (isExpired) {
        await refreshToken();
        setTokenInfo();
        getTokenInfo();
        return;
      }
    }
  } else {
    return undefined;
  }

  return tokenInfo;
};
