"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ApiHealth() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/health-check"
        );
        setIsOnline(response.status === 200);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkHealth();
  }, []);

  if (isOnline === null) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700">
        <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
        <span className="text-sm font-medium text-zinc-400">Checking...</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
        isOnline
          ? "bg-green-500/10 border-green-500/30"
          : "bg-red-500/10 border-red-500/30"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isOnline ? "text-green-400" : "text-red-400"
        }`}
      >
        API {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}
