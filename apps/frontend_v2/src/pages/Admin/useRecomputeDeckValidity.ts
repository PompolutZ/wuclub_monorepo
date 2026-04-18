import { useMutation } from "@tanstack/react-query";
import Firebase from "../../firebase";
import { api } from "../../services/api";

export const useRecomputeDeckValidity = () =>
  useMutation({
    mutationFn: async () => {
      const token = await Firebase.getTokenId();
      const res = await api.v2.admin.jobs["recompute-deck-validity"].$post(
        undefined,
        { headers: { authtoken: token } },
      );
      return res.json();
    },
  });
