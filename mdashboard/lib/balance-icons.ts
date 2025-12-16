import { BalanceEventType } from "@/lib/types";
import {
    Wrench,
    Fuel,
    UtensilsCrossed,
    Landmark,
    Shield,
    Receipt,
    Wallet,
    Megaphone,
    MonitorSmartphone,
    Zap,
    CircleDollarSign,
    TrendingUp,
    Package,
    DollarSign,
    type LucideIcon,
} from "lucide-react";

export interface BalanceEventIconConfig {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    label: string;
}

export function getBalanceEventIcon(type: BalanceEventType): BalanceEventIconConfig {
    const config: Record<BalanceEventType, BalanceEventIconConfig> = {
        [BalanceEventType.VEHICLE_MAINTENANCE]: {
            icon: Wrench,
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            iconColor: "text-orange-600 dark:text-orange-400",
            label: "Vehicle Maintenance",
        },
        [BalanceEventType.FUEL]: {
            icon: Fuel,
            bgColor: "bg-red-100 dark:bg-red-900/30",
            iconColor: "text-red-600 dark:text-red-400",
            label: "Fuel",
        },
        [BalanceEventType.FOOD]: {
            icon: UtensilsCrossed,
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            label: "Food",
        },
        [BalanceEventType.TOLL]: {
            icon: Landmark,
            bgColor: "bg-slate-100 dark:bg-slate-900/30",
            iconColor: "text-slate-600 dark:text-slate-400",
            label: "Toll",
        },
        [BalanceEventType.INSURANCE]: {
            icon: Shield,
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            label: "Insurance",
        },
        [BalanceEventType.TAX]: {
            icon: Receipt,
            bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
            iconColor: "text-indigo-600 dark:text-indigo-400",
            label: "Tax",
        },
        [BalanceEventType.SALARY]: {
            icon: Wallet,
            bgColor: "bg-violet-100 dark:bg-violet-900/30",
            iconColor: "text-violet-600 dark:text-violet-400",
            label: "Salary",
        },
        [BalanceEventType.MARKETING]: {
            icon: Megaphone,
            bgColor: "bg-pink-100 dark:bg-pink-900/30",
            iconColor: "text-pink-600 dark:text-pink-400",
            label: "Marketing",
        },
        [BalanceEventType.SOFTWARE]: {
            icon: MonitorSmartphone,
            bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
            iconColor: "text-cyan-600 dark:text-cyan-400",
            label: "Software",
        },
        [BalanceEventType.UTILITIES]: {
            icon: Zap,
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            iconColor: "text-yellow-600 dark:text-yellow-400",
            label: "Utilities",
        },
        [BalanceEventType.OTHER_EXPENSE]: {
            icon: CircleDollarSign,
            bgColor: "bg-gray-100 dark:bg-gray-900/30",
            iconColor: "text-gray-600 dark:text-gray-400",
            label: "Other Expense",
        },
        [BalanceEventType.FREIGHT_INCOME]: {
            icon: TrendingUp,
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            label: "Freight Income",
        },
        [BalanceEventType.ASSET_SALE]: {
            icon: Package,
            bgColor: "bg-teal-100 dark:bg-teal-900/30",
            iconColor: "text-teal-600 dark:text-teal-400",
            label: "Asset Sale",
        },
        [BalanceEventType.OTHER_INCOME]: {
            icon: DollarSign,
            bgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            label: "Other Income",
        },
    };

    return config[type];
}
