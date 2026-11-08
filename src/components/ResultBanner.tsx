import { CheckCircle2, XCircle } from "lucide-react";
import type { CheckResult } from "@/lib/types";

interface ResultBannerProps {
  result: CheckResult | null;
}

export function ResultBanner({ result }: ResultBannerProps) {
  if (!result) return null;

  const isAvailable = result.decision === "available";

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "rounded-xl border-2 p-5 transition-all duration-300",
        isAvailable
          ? "border-emerald-300 bg-emerald-50"
          : "border-red-300 bg-red-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isAvailable ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          ) : (
            <XCircle className="w-7 h-7 text-red-600" />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={[
              "text-lg font-bold",
              isAvailable ? "text-emerald-700" : "text-red-700",
            ].join(" ")}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </p>
          <p
            className={[
              "text-sm mt-0.5",
              isAvailable ? "text-emerald-600" : "text-red-600",
            ].join(" ")}
          >
            {result.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
