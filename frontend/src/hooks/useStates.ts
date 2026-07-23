import { useQuery } from "@tanstack/react-query";
import { fetchStateDetail, fetchStates } from "../api/client";

export const stateKeys = {
  all: ["states"] as const,
  detail: (detailUrl: string) => ["states", "detail", detailUrl] as const,
};

export function useStatesQuery() {
  return useQuery({
    queryKey: stateKeys.all,
    queryFn: fetchStates,
  });
}

export function useStateDetailQuery(detailUrl: string | null) {
  return useQuery({
    queryKey: stateKeys.detail(detailUrl ?? ""),
    queryFn: () => fetchStateDetail(detailUrl!),
    enabled: Boolean(detailUrl),
  });
}
