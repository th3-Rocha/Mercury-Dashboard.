import { Card } from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterAproved() {
  return (
    <div className="relative flex  flex-col  overflow-hidden">
      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800">
          <div className="p-6">
            {/* Header */}
            <div className="text-center space-y-4 mb-6">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Registration Successful!
              </h1>
              <p className="text-zinc-400 text-base">
                Your account has been created successfully.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-300 font-medium">
                      Confirmation Email Sent
                    </p>
                    <p className="text-sm text-zinc-400">
                      We've sent a confirmation email to your inbox. Please
                      check your email and click the confirmation link to
                      activate your account.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/dashboard" className="block">
                <Button className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
