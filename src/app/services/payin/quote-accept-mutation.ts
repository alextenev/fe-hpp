import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptQuote } from "./api";
import { useRouter } from "next/navigation";

export const useAcceptQuote = () => {
  const router = useRouter();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { uuid: string }) => acceptQuote(payload.uuid),
    onSuccess: async (_data, variables, _context) => {
      await client.invalidateQueries();
      router.push(`/payin/${variables.uuid}/pay`);
    },
  });
};
