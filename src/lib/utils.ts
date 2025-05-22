import { QuoteSummary } from "@/app/services/payin/quote-summary.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isQuoteExpired = (data: QuoteSummary | undefined): boolean =>
  data?.status === "EXPIRED";

export const isQuoteAccepted = (data: QuoteSummary | undefined): boolean =>
  data?.quoteStatus === "ACCEPTED";
