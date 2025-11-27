"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CompanyStatus } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  status: z.enum(CompanyStatus),
  walletBalance: z.coerce.number().min(0, "Wallet balance cannot be negative"),
  hexColor: z
    .string()
    .min(4, "Invalid hex code")
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid Hex Color format"),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  initialData?: CompanyFormValues;
  onSubmit: (data: CompanyFormValues) => void;
  isLoading?: boolean;
}

export function CompanyForm({
  initialData,
  onSubmit,
  isLoading,
}: CompanyFormProps) {
  const form = useForm({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData || {
      name: "",
      status: CompanyStatus.ACTIVE,
      walletBalance: 0,
      hexColor: "#FFFFFF",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Inc."
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:ring-indigo-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {/* Convertendo Enum para Array para o map funcionar */}
                  {Object.values(CompanyStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="focus:bg-zinc-800 focus:text-white cursor-pointer"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Wallet Balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                  {...field}
                  value={
                    typeof field.value === "number" ||
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hexColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Brand Color</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <div className="relative w-10 h-10 rounded-md border border-zinc-800 overflow-hidden shrink-0">
                    <input
                      type="color"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                  <Input
                    placeholder="#FFFFFF"
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 font-mono uppercase focus-visible:ring-indigo-500"
                    maxLength={7}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-zinc-500">
                Hex code or picker.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
