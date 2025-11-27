import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPassword() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-md">
          <span className="text-white text-2xl block mb-4">Reset Password</span>
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  );
}
