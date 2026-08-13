"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { BUSINESS_CATEGORIES, submitOnboarding } from "@/lib/api";
import { BigButton } from "@/components/BigButton";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import type { BusinessGoal } from "@/lib/types";

const GOALS: { value: BusinessGoal; labelKey: "Grow customer base" | "Grow revenue" | "Other" }[] = [
  { value: "grow_customers", labelKey: "Grow customer base" },
  { value: "grow_revenue", labelKey: "Grow revenue" },
  { value: "other", labelKey: "Other" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [goal, setGoal] = useState<BusinessGoal | null>(null);
  const [goalOther, setGoalOther] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      const participantId = localStorage.getItem("participantId");
      if (!participantId) throw new Error("Missing participant — please rejoin.");
      return submitOnboarding(participantId, {
        businessName,
        businessCategory,
        goal: goal as BusinessGoal,
        goalOther: goal === "other" ? goalOther : undefined,
      });
    },
    onSuccess: () => router.push("/waiting"),
  });

  const canSubmit = businessName && businessCategory && goal && (goal !== "other" || goalOther);

  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-brand-offwhite px-6 py-12">
      <InteractiveBackground />
      <div className="relative z-10 mx-auto w-full max-w-sm">
        <h1 className="font-headline text-3xl leading-tight text-brand-charcoal">
          {t("onboarding", "headline")}
        </h1>

        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) mutation.mutate();
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-charcoal/70">
              {t("onboarding", "businessNameLabel")}
            </label>
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t("onboarding", "businessNamePlaceholder")}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg text-brand-charcoal outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-charcoal/70">
              {t("onboarding", "categoryLabel")}
            </label>
            <select
              required
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg text-brand-charcoal outline-none focus:border-brand-orange"
            >
              <option value="" disabled>
                {t("onboarding", "categoryPlaceholder")}
              </option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-charcoal/70">
              {t("onboarding", "goalLabel")}
            </label>
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`rounded-xl border-2 px-4 py-4 text-left text-lg font-medium transition-colors ${
                    goal === g.value
                      ? "border-brand-orange bg-brand-orange/10 text-brand-charcoal"
                      : "border-black/10 bg-white text-brand-charcoal/80"
                  }`}
                >
                  {translations.onboarding.goals[g.labelKey][lang]}
                </button>
              ))}
              {goal === "other" && (
                <input
                  autoFocus
                  value={goalOther}
                  onChange={(e) => setGoalOther(e.target.value)}
                  placeholder={t("onboarding", "goalOther")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg text-brand-charcoal outline-none focus:border-brand-orange"
                />
              )}
            </div>
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-600">
              {(mutation.error as Error).message || t("onboarding", "genericError")}
            </p>
          )}

          <BigButton type="submit" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? t("onboarding", "saving") : t("onboarding", "continue")}
          </BigButton>
        </form>
      </div>
    </main>
  );
}
