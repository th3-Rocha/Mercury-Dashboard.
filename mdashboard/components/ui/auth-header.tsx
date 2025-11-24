import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
  linkHref: string;
  linkText: string;
}

export default function AuthHeader({ linkHref, linkText }: AuthHeaderProps) {
  return (
    <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-lg">M</span>
          </div>
          <span className="text-white font-semibold text-xl">Mercury</span>
        </div>

        <Link href={linkHref}>
          <Button className="px-6 py-2 bg-white text-black cursor-pointer font-medium rounded-lg hover:bg-zinc-200 transition-colors">
            {linkText}
          </Button>
        </Link>
      </div>
    </header>
  );
}
