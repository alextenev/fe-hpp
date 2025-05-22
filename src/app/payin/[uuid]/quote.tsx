import { UseMutationResult } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Countdown from "@/components/ui/countdown";

import { QuoteSummary } from "@/app/services/payin/quote-summary.model";
import { useAcceptQuote } from "@/app/services/payin/quote-accept-mutation";

type QuoteParams = {
  uuid: string;
  updateQuote: UseMutationResult<
    QuoteSummary,
    Error,
    {
      uuid: string;
      currency: string;
    },
    unknown
  >;
  onQuoteExpiry: () => void;
};

export default function Quote({
  uuid,
  updateQuote,
  onQuoteExpiry,
}: QuoteParams) {
  const acceptQuoteMutation = useAcceptQuote();

  return (
    <div>
      <hr className="border-(--line-gray)" />
      <section className="flex justify-between py-3">
        <span className="text-[14px] font-normal text-(--secondary-text)">
          Amount due
        </span>
        <span>
          {updateQuote.isSuccess ? (
            `${updateQuote.data?.paidCurrency.amount} ${updateQuote.data?.paidCurrency.currency}`
          ) : (
            <Spinner />
          )}
        </span>
      </section>

      <hr className="border-(--line-gray)" />

      <section className="flex justify-between py-3">
        <span className="leading-[22px] text-[14px] font-normal text-(--secondary-text)">
          Quoted price expires in
        </span>
        <span>
          {updateQuote.isSuccess ? (
            <Countdown
              timestamp={updateQuote.data?.acceptanceExpiryDate}
              onExpiry={onQuoteExpiry}
            />
          ) : (
            <Spinner />
          )}
        </span>
      </section>

      <hr className="border-(--line-gray) pb-[25px]" />

      <Button
        disabled={acceptQuoteMutation.isPending}
        className="w-full h-[40px] bg-(--primary-color) rounded-sm"
        onClick={() => acceptQuoteMutation.mutate({ uuid })}
      >
        {acceptQuoteMutation.isPending ? "Processing..." : "Confirm"}
      </Button>
    </div>
  );
}
