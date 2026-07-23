import { useQuery } from "@tanstack/react-query";
import { fetchStateDetail, fetchStates } from "../api/client";

export const stateKeys = {
  all: ["states"] as const,
  detail: (name: string) => ["states", name] as const,
};

export function useStatesQuery() {
  return useQuery({
    queryKey: stateKeys.all,
    queryFn: fetchStates,
  });
}

export function useStateDetailQuery(name: string | null) {
  return useQuery({
    queryKey: stateKeys.detail(name ?? ""),
    queryFn: () => fetchStateDetail(name!),
    enabled: Boolean(name),
  });
}
