"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/AuthContext";
import { User, LayoutDashboard, UserCircle, Building2 } from "lucide-react";

interface AuthHeaderProps {
  linkHref: string;
  linkText: string;
}

export default function AuthHeader({ linkHref, linkText }: AuthHeaderProps) {
  const { isAuthenticated, user, isChecking } = useAuthContext();
  const router = useRouter();

  return (
    <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-lg">M</span>
          </div>
          <span className="text-white font-semibold text-xl">
            Mercury Fleet
          </span>
        </Link>

        {isChecking ? (
          <div className="px-6 py-2 text-zinc-400">.</div>
        ) : isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="px-4 cursor-pointer py-2 hover:text-green-500 font-medium hover:bg-zinc-800/80 rounded-lg transition-colors flex items-center gap-2 focus:ring-0 focus:ring-offset-0 outline-none"
              >
                <User className="h-4 w-4" />
                {user.name.slice(0, 15)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-zinc-400">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer text-zinc-200 focus:text-white focus:bg-zinc-800/50"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/account")}
                className="cursor-pointer text-zinc-200 focus:text-white focus:bg-zinc-800/50"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={linkHref}>
            <Button className="px-6 py-2 bg-white text-black cursor-pointer font-medium rounded-lg hover:bg-zinc-200 transition-colors">
              {linkText}
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
