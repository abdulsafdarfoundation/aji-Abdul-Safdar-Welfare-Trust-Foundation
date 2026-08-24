"use client";

import { useActionState, useId } from "react";
import { Loader2 } from "lucide-react";

import { signIn, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    signIn,
    null,
  );

  const emailId = useId();
  const passwordId = useId();
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <Label htmlFor={emailId}>Email</Label>
        <Input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p role="alert" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={passwordId}>Password</Label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p role="alert" className="text-sm text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      {state?.formError && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.formError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Sign in
      </Button>
    </form>
  );
}
