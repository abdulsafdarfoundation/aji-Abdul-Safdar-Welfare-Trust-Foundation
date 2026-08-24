"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { fieldErrors, loginSchema } from "@/lib/validations";

export type LoginState = {
  errors?: Record<string, string>;
  formError?: string;
} | null;

export async function signIn(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  if (!isSupabaseConfigured) {
    return {
      formError:
        "Demo mode — sign-in is disabled. The dashboard is already open at /admin.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Deliberately vague: telling an attacker which half was wrong is a gift.
    return { formError: "Those credentials did not match an account." };
  }

  const next = String(formData.get("next") || "/admin");
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
