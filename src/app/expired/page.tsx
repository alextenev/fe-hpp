import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";

export default function Expired() {
  return (
    <Card className="w-full sm:w-115 mx-auto border-none shadow-none rounded-[10px] p-6 sm:p-16">
      <Image
        src="/warning.svg"
        alt="warning"
        width={48}
        height={48}
        className="self-center"
      />
      <CardTitle className="text-center text-[20px]">
        <h1>Payment details expired</h1>
      </CardTitle>
      <p className="text-center text-[15px] text-(--secondary-text)">
        The payment details for your transaction have expired.
      </p>
    </Card>
  );
}
