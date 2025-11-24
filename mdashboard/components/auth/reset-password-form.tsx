"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const { changePassword, isLoading, error } = useAuth();
  const { isAuthenticated, isChecking } = useAuthContext();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (isChecking) {
    return <div className="text-white text-center py-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await changePassword(
      values.currentPassword,
      values.newPassword
    );

    if (result.success) {
      setSuccess(true);
      form.reset();
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                  {...field}
                />
              </FormControl>
              <div className="h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                  {...field}
                />
              </FormControl>
              <div className="h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                  {...field}
                />
              </FormControl>
              <div className="h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black hover:bg-zinc-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </Button>
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-md text-sm">
            Password changed successfully! Redirecting to dashboard...
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
      </form>
    </Form>
  );
}
