import MouseLight from "@/src/components/MouseLight";
import AuthHeader from "@/components/ui/auth-header";
import GridBackground from "@/components/ui/grid-background";

import { RegisterForm } from "@/components/auth/register-form";
import { LoginForm } from "@/components/auth/login-form";

export default function Register() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      <GridBackground />

      <MouseLight />

      <AuthHeader linkHref="/login" linkText="Login" />

      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-md">
          <span className="text-white text-2xl block mb-4">Dashboard</span>
        </div>
      </main>
    </div>
  );
}
