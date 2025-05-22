"use client";

import { usePayInSummary } from "@/app/services/payin/query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Countdown from "@/components/ui/countdown";
import { CRYPTO_CURRENCIES } from "@/lib/constants";
import { isQuoteExpired } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import CopiableText from "./copiable-text";
import { useEffect, useState } from "react";

export default function Expired() {
  const { uuid } = useParams();

  if (!uuid) {
    // redirect to error page;
    return;
  }

  const truncateMiddle = (str: string, maxLength = 32): string => {
    const ellipsis = "...";
    const len = str.length;
    const elLen = ellipsis.length;

    if (len <= maxLength || maxLength <= elLen + 1) {
      return len > maxLength ? ellipsis : str;
    }

    const target = maxLength - elLen;

    const front = Math.ceil(target / 2);
    const back = target - front;

    return str.slice(0, front) + ellipsis + str.slice(len - back);
  };

  const { data, isLoading, error } = usePayInSummary(uuid.toString());
  const router = useRouter();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (expired) {
      router.push("/expired");
    }
  }, [expired]);

  if (isLoading) {
    return <div>Loading..</div>;
  }

  if (error || !data) {
    return <div>Error...</div>;
  }

  if (isQuoteExpired(data)) {
    setExpired(true);
    return null;
  }

  const displayCurrency = CRYPTO_CURRENCIES[data.paidCurrency.currency];

  return (
    <Card className="w-full sm:w-115 mx-auto border-none shadow-none rounded-[10px] p-6">
      <CardHeader className="px-12">
        <CardTitle className="text-center text-xl mb-6">
          Pay with {displayCurrency}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          To complete this payment send the amount due to the{" "}
          {data.paidCurrency.currency} address provided below.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-stretch gap-3 text-sm">
        <hr />

        <section className="flex justify-between">
          <span className="text-sm text-(--secondary-text)">Amount due</span>
          <CopiableText
            text={`${data.paidCurrency.amount} ${data.paidCurrency.currency}`}
            textToCopy={String(data.paidCurrency.amount)}
          ></CopiableText>
        </section>

        <hr />

        <div className="flex justify-between text-nowrap">
          <span className="text-(--secondary-text)">
            {data.paidCurrency.currency} address
          </span>
          <p className="w-32">{}</p>

          <CopiableText
            text={truncateMiddle(data.address.address, 14)}
            textToCopy={data.address.address}
          ></CopiableText>
        </div>

        <QRCodeSVG value={data.address.uri} className="self-center" />

        <p className="text-xs text-(--secondary-text) self-center">
          {data.address.address}
        </p>

        <hr />

        <section className="flex justify-between">
          <span className="text-(--secondary-text)">Time left to pay</span>

          <Countdown
            timestamp={data.expiryDate}
            onExpiry={() => setExpired(true)}
          />
        </section>

        <hr />
      </CardContent>
    </Card>
  );
}
