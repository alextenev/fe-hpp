"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { ChevronsUpDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { usePayInSummary } from "@/app/services/payin/query";
import { useState } from "react";
import Quote from "./quote";
import { useUpdateQuote } from "@/app/services/payin/quote-mutation";
import { CRYPTO_CURRENCIES } from "@/lib/constants";
import { isQuoteAccepted, isQuoteExpired } from "@/lib/utils";

export default function PayIn() {
  const { uuid } = useParams();

  if (!uuid) {
    // redirect to error page;
    return;
  }

  const { data, isLoading, error } = usePayInSummary(uuid.toString());
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const updateQuote = useUpdateQuote();
  const router = useRouter();

  const handleSelectChange = (event: any): void => {
    setSelectedCurrency(event);
    updateQuote.mutate({ uuid: uuid.toString(), currency: event });
  };

  const doUpdateQuote = (uuid: string, currency: string): void => {
    updateQuote.mutate({ uuid, currency });
  };

  if (isLoading) return <div>Loading...</div>;

  if (error || !data) return <div>Error</div>;

  if (isQuoteExpired(data)) {
    router.push("/expired");
    return null;
  }

  if (isQuoteAccepted(data)) {
    router.push(`/payin/${data.uuid}/pay`);
    return;
  }

  return (
    <Card className="w-full sm:w-115 mx-auto border-none shadow-none rounded-[10px] p-6">
      <CardHeader>
        <CardTitle className="text-[20px] font-medium text-center">
          {data.merchantDisplayName}
        </CardTitle>
        <p className="text-[32px] text-center font-semibold">
          {data.displayCurrency.amount}{" "}
          <span className="text-[20px]">{data.displayCurrency.currency}</span>
        </p>
      </CardHeader>
      <p className="text-(--secondary-text) text-center">
        For reference number:{" "}
        <span className="text-(--card-foreground)">REF292970</span>
      </p>

      <section>
        <Label htmlFor="currency" className="text-[14px]">
          Pay with
        </Label>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger
            data-testid="select-trigger"
            className="w-full min-h-14"
            rightIcon={<ChevronsUpDown className="size-4" />}
          >
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CRYPTO_CURRENCIES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {selectedCurrency ? (
        <Quote
          uuid={uuid.toString()}
          updateQuote={updateQuote}
          onQuoteExpiry={() => doUpdateQuote(uuid.toString(), selectedCurrency)}
        />
      ) : null}
    </Card>
  );
}
