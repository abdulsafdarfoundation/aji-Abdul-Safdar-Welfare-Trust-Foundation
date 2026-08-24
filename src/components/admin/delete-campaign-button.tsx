"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Deleting a campaign detaches its donation history (the FK is ON DELETE SET
 * NULL), so it is worth one confirmation step.
 */
export function DeleteCampaignButton({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          title="Delete"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete {title}</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete “{title}”?</DialogTitle>
          <DialogDescription>
            The campaign is removed from the site permanently. Donations already recorded
            against it are kept, but they lose their designation and show as “where needed
            most”. Consider archiving it instead.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <form action={action} onSubmit={() => setOpen(false)}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="destructive">
              Delete campaign
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
