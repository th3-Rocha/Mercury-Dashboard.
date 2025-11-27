"use client";
import MouseLight from "@/src/components/MouseLight";
import AuthHeader from "@/components/ui/auth-header";
import GridBackground from "@/components/ui/grid-background";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Asterisk } from "lucide-react";
import Cookies from "js-cookie";

export default function Account() {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      <GridBackground />
      <MouseLight />
      <AuthHeader linkHref="/login" linkText="Login" />

      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-white text-3xl font-bold mb-6">
            Account Settings
          </h1>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-white text-xl font-semibold mb-4">
                Security
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/reset-password")}
                  className="w-full sm:w-auto cursor-pointer  px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Asterisk className="h-4 w-4" />
                  Reset Password
                </Button>
                <div className="pt-3 border-t border-zinc-800">
                  <Button
                    onClick={handleLogout}
                    className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
