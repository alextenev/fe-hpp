import { useQuery } from "@tanstack/react-query";
import { getQuoteSummary } from "./api";

export const usePayInSummary = (uuid: string) => {
  return useQuery({
    queryKey: ["payIn", uuid],
    queryFn: () => getQuoteSummary(uuid),
  });
};
