import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeToGoLogin(token: string | undefined): number {
  if (!token) return 0;

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) return 0;
    const timeToGoLogin = decoded.exp * 1000;

    return timeToGoLogin;
  } catch (error) {
    return 0;
  }
}

export function isTokenExpired(token: string | undefined): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    const exp = decoded.exp;

    if (!exp) return false;

    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function isTokenExpiringSoon(
  token: string | undefined,
  secondsThreshold: number = 30,
): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    const exp = decoded.exp;

    if (!exp) return false;

    const currentTime = Date.now() / 1000;
    const timeUntilExpiration = exp - currentTime;

    return timeUntilExpiration <= secondsThreshold;
  } catch (error) {
    return true;
  }
}
