"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await login({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* --- EMAIL --- */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                  {...field}
                />
              </FormControl>
              <div className="h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* --- PASSWORD COM TOGGLE --- */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500 pr-10" // pr-10 para o texto não ficar embaixo do ícone
                    {...field}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
          className="w-full bg-white text-black hover:bg-zinc-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}
      </form>
    </Form>
  );
}
