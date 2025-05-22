import { useMutation } from "@tanstack/react-query";
import { updateQuote } from "./api";
import { useRouter } from "next/navigation";
import { isQuoteAccepted, isQuoteExpired } from "@/lib/utils";

export const useUpdateQuote = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { uuid: string; currency: string }) =>
      updateQuote(payload.uuid, payload.currency),
    onSuccess: (data, _variables, _context) => {
      if (isQuoteExpired(data)) {
        router.push("/expired");
        return;
      }

      if (isQuoteAccepted(data)) {
        router.push(`/payin/${data.uuid}/pay`);
        return;
      }
    },
  });
};
