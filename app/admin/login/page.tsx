"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "@/lib/api";
import { BigButton } from "@/components/BigButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => adminLogin(email, password),
    onSuccess: (data) => {
      localStorage.setItem("adminToken", data.accessToken);
      router.push("/admin/sessions");
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-offwhite px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-3xl text-brand-charcoal">Admin login</h1>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg outline-none focus:border-brand-orange"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg outline-none focus:border-brand-orange"
          />
          {mutation.isError && (
            <p className="text-sm text-red-600">
              {(mutation.error as Error).message || "Login failed."}
            </p>
          )}
          <BigButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </BigButton>
        </form>
      </div>
    </main>
  );
}
