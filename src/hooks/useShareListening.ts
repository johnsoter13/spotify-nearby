import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { ShareListeningInput } from "./useShareListening.types";

export function useShareListening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShareListeningInput) =>
      api("/api/listening", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nearbyListeners"] });
    },
  });
}