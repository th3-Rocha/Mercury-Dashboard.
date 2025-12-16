"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCompanyContext } from "@/contexts/CompanyContext";

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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // Opcional: para feedback visual

// 1. Schema de Validação
const formSchema = z.object({
  tradeName: z.string().min(2, {
    message: "Trade name must be at least 2 characters.",
  }),
  legalName: z.string().min(2, {
    message: "Legal name must be at least 2 characters.",
  }),
  supportEmail: z.string().email("Invalid email address"),
  mainPhone: z.string().min(7, "Phone number must be at least 7 characters"),
});

type CompanyFormValues = z.infer<typeof formSchema>;

export function CompanySettingsForm() {
  const {
    company,
    isLoading: isContextLoading,
    updateCompany: contextUpdateCompany,
  } = useCompanyContext();

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tradeName: "",
      legalName: "",
      supportEmail: "",
      mainPhone: "",
    },
  });

  useEffect(() => {
    if (!isContextLoading && company) {
      form.reset({
        tradeName: company.tradeName || "",
        legalName: company.legalName || "",
        supportEmail: company.supportEmail || "",
        mainPhone: company.mainPhone || "",
      });
    }
  }, [company, isContextLoading, form]);

  async function onSubmit(values: CompanyFormValues) {
    setIsSaving(true);
    try {
      await contextUpdateCompany(values);
      toast.success("Company settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  }

  // 6. Loading State (Skeleton)
  if (isContextLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full bg-zinc-800" />
        <Skeleton className="h-10 w-full bg-zinc-800" />
        <Skeleton className="h-10 w-[100px] bg-zinc-800" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tradeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Trade Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Inc."
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
          name="legalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Legal Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Inc. Legal Entity"
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
          name="supportEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Support Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="support@company.com"
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
          name="mainPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Main Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1 (555) 123-4567"
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
          disabled={isSaving}
          className="w-full bg-white text-black hover:bg-zinc-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
