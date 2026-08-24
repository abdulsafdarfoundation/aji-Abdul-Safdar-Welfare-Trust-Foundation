"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DonationStatus } from "@/types/database";

const OPTIONS: { value: DonationStatus; label: string }[] = [
  { value: "completed", label: "Mark completed" },
  { value: "pending", label: "Mark pending" },
  { value: "failed", label: "Mark failed" },
  { value: "refunded", label: "Mark refunded" },
];

/**
 * Each menu item submits its own form, so status changes are real Server Action
 * mutations — they work without JS and revalidate the dashboard on completion.
 */
export function DonationStatusMenu({
  id,
  reference,
  current,
  action,
}: {
  id: string;
  reference: string;
  current: DonationStatus;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Change status of {reference}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-mono text-xs">{reference}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.filter((option) => option.value !== current).map((option) => (
          <DropdownMenuItem key={option.value} asChild>
            <form action={action}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value={option.value} />
              <button
                type="submit"
                className="w-full cursor-pointer px-0 text-left text-sm"
              >
                {option.label}
              </button>
            </form>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
