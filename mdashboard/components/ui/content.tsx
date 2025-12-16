import { Calendar, CreditCard, Wallet } from "lucide-react";
import List01 from "./balance-dash";
import List02 from "./list-02";
import List03 from "./list-03";
import { ShipmentEventsList } from "./shipment-events-list";
import BalanceDash from "./balance-dash";
import ViewTrucksMapRealtime from "./list-02";

export default function () {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BalanceDash className="h-full w-full" />
        <ViewTrucksMapRealtime className="h-full" />
      </div>

      <div className="rounded-xl p-4 sm:p-6 flex flex-col items-start justify-start">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
          Shipment Events
        </h2>
        <ShipmentEventsList />
      </div>
    </div>
  );
}
