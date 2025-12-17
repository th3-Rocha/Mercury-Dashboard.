"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { isTokenExpiringSoon } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";

interface UseTokenExpirySoonOptions {
  secondsThreshold?: number;
  checkInterval?: number;
  onTokenExpiringSoon?: () => void;
}

/**
 * Hook that monitors the JWT token expiration time and redirects to login
 * if the token will expire in 30 seconds or less (configurable).
 *
 * @param options Configuration options
 * @param options.secondsThreshold - Number of seconds before expiration to consider token "expiring soon" (default: 30)
 * @param options.checkInterval - Interval in milliseconds to check token expiration (default: 5000)
 * @param options.onTokenExpiringSoon - Optional callback when token is expiring soon
 *
 * @example
 * // In a component
 * useTokenExpirySoon();
 *
 * // With custom options
 * useTokenExpirySoon({
 *   secondsThreshold: 60,
 *   checkInterval: 10000,
 *   onTokenExpiringSoon: () => console.log('Token expiring soon!')
 * });
 */
export function useTokenExpirySoon(options: UseTokenExpirySoonOptions = {}) {
  const {
    secondsThreshold = 30,
    checkInterval = 5000,
    onTokenExpiringSoon,
  } = options;

  const router = useRouter();
  const { setIsAuthenticated, setUser } = useAuthContext();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = Cookies.get("access_token");

      if (!token) {
        // Token doesn't exist, redirect to login
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          setIsAuthenticated(false);
          setUser(null);
          router.push("/login");
        }
        return;
      }

      // Check if token is expiring soon
      if (isTokenExpiringSoon(token, secondsThreshold)) {
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;

          // Call optional callback
          if (onTokenExpiringSoon) {
            onTokenExpiringSoon();
          }

          // Clear token and redirect to login
          Cookies.remove("access_token", { path: "/" });
          setIsAuthenticated(false);
          setUser(null);
          router.push("/login");
        }
      }
    };

    // Initial check
    checkTokenExpiration();

    // Set up interval to check periodically
    intervalIdRef.current = setInterval(checkTokenExpiration, checkInterval);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [
    router,
    secondsThreshold,
    checkInterval,
    onTokenExpiringSoon,
    setIsAuthenticated,
    setUser,
  ]);
}
