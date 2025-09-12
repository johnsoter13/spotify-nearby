import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { MeResponse } from "../lib/api.types";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api<MeResponse>("/api/me"),
  });
}