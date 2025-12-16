"use client";

import {
  LayoutDashboard,
  IdCardLanyard,
  Package,
  Settings,
  HelpCircle,
  Menu,
  Truck,
  Receipt,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Skeleton } from "./skeleton";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { company } = useCompanyContext();

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
      >
        <Icon className="h-4 w-4 mr-3 shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed h-full top-4 left-4 z-70 p-2 rounded-lg bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-70 w-64 bg-white dark:bg-zinc-900/50 transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border rounded-2xl border-gray-200 dark:border-zinc-800
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {company?.tradeName || <Skeleton className="w-36 h-5" />}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/dashboard/shipments" icon={Package}>
                    Shipments
                  </NavItem>
                </div>
                <div className="px-3 mb-2 mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Operations
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard/employees" icon={IdCardLanyard}>
                    Employees
                  </NavItem>
                  <NavItem href="/dashboard/trucks" icon={Truck}>
                    Trucks
                  </NavItem>
                  <NavItem href="/dashboard/recipients" icon={Receipt}>
                    Recipients
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="space-y-1">
              <NavItem href="/dashboard/company" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-65 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
