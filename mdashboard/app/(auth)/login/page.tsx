import { LoginForm } from "@/app/(auth)/login/login-form";

export default function Register() {
  return (
    <div className="relative flex flex-col bg-transparent  overflow-hidden">
      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-full  justify-center  items-center max-w-md">
          <span className="text-white text-2xl block mb-4">Login</span>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
