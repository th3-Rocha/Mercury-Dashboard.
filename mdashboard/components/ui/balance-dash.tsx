"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBalanceContext } from "@/contexts/BalanceContext";
import { getBalanceEventIcon } from "@/lib/balance-icons";
import { BalanceEventType } from "@/lib/types";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface BalanceDashProps {
  className?: string;
}

export default function BalanceDash({ className }: BalanceDashProps) {
  const { balanceEvents, isLoading, addBalanceEvent, removeBalanceEvent, refreshBalanceEvents } = useBalanceContext();
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const incomeTypes: BalanceEventType[] = [
    BalanceEventType.FREIGHT_INCOME,
    BalanceEventType.ASSET_SALE,
    BalanceEventType.OTHER_INCOME,
  ];

  const { incomeTotal, expenseTotal, netTotal } = useMemo(() => {
    const incomeTotal =
      balanceEvents?.filter((e) => incomeTypes.includes(e.type)).reduce((s, e) => s + Number(e.amount), 0) || 0;
    const expenseTotal =
      balanceEvents?.filter((e) => !incomeTypes.includes(e.type)).reduce((s, e) => s + Number(e.amount), 0) || 0;
    return { incomeTotal, expenseTotal, netTotal: incomeTotal - expenseTotal };
  }, [balanceEvents]);

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
      await removeBalanceEvent(eventToDelete);
      await refreshBalanceEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    } finally {
      setEventToDelete(null);
    }
  };

  // Local state for add form (Shadcn controlled inputs)
  const [type, setType] = useState<BalanceEventType | undefined>();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<Date | undefined>(new Date());

  const resetForm = () => {
    setType(undefined);
    setDescription("");
    setAmount("");
    setOccurredAt(new Date());
  };

  const onSubmit = async () => {
    if (!type || !description || !amount || !occurredAt) return;
    try {
      setSubmitting(true);
      await addBalanceEvent({
        amount: Number(amount),
        description,
        type,
        occurredAt: occurredAt.toISOString(),
      });
      await refreshBalanceEvents();
      resetForm();
      setIsAdding(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "w-full  mx-auto bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-zinc-400">Total Balance</CardTitle>
              <div className="mt-1 text-2xl font-semibold text-white">
                ${netTotal.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-6">
            <div>
              <p className="text-[10px] text-zinc-500">Income</p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ${incomeTotal.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500">Expenses</p>
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                ${expenseTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-zinc-800" />

        <CardContent className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-medium text-zinc-100">Balance Events</h2>

            <Popover open={isAdding} onOpenChange={setIsAdding}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-xs text-zinc-300 hover:text-white cursor-pointer"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Event
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-4 bg-zinc-900 border border-zinc-800">
                <div className="space-y-3">

                  <div className="space-y-2">
                    <Label className="text-xs">Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as BalanceEventType)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BalanceEventType).map((t) => {
                          const cfg = getBalanceEventIcon(t);
                          return (
                            <SelectItem key={t} value={t} className="text-xs">
                              {cfg.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="h-8 text-xs"
                      placeholder="e.g. Fuel, Toll, Freight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-8 text-xs"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 text-xs text-left font-normal text-zinc-300 hover:text-white"
                        >
                          {occurredAt ? occurredAt.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0 bg-zinc-900 border border-zinc-800">
                        <Calendar
                          mode="single"
                          selected={occurredAt}
                          onSelect={setOccurredAt}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="ghost"
                      className="flex-1 h-8"
                      onClick={() => {
                        resetForm();
                        setIsAdding(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 h-8"
                      onClick={onSubmit}
                      disabled={submitting || !type || !description || !amount || !occurredAt}
                    >
                      {submitting ? "Adding..." : "Add Event"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {isLoading ? (
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 animate-pulse h-12" />
              ))}
            </div>
          ) : !balanceEvents || balanceEvents.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">No balance events yet</div>
          ) : (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {balanceEvents
                .slice()
                .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
                .map((event) => {
                  const iconConfig = getBalanceEventIcon(event.type);
                  const Icon = iconConfig.icon;
                  const isIncome = incomeTypes.includes(event.type);

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "group flex items-center justify-between p-2 rounded-lg",
                        "hover:bg-zinc-800/60 transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={cn("p-1.5 rounded-lg", iconConfig.bgColor)}>
                          <Icon className={cn("w-3.5 h-3.5", iconConfig.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-medium text-zinc-100 truncate">
                            {event.description}
                          </h3>
                          <p className="text-[10px] text-zinc-400">
                            {new Date(event.occurredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={cn(
                            "text-xs font-medium tabular-nums mr-1",
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {isIncome ? "+" : "-"}${Number(event.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 rounded-full hover:bg-zinc-700/60 cursor-pointer"
                          onClick={() => handleDeleteClick(event.id)}
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>

      </Card>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Balance Event"
        description="Are you sure you want to delete this balance event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </>
  );
}
