import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import useAuthUser from "../../hooks/useAuthUser";
import Firebase from "../../firebase";
import { Factions } from "@fxdxpz/schema";

const QUERY_KEY = "user";

export const useQueryUserData = () => {
  const user = useAuthUser();
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      if (!user) return;
      const token = await Firebase.getTokenId();
      const r = await api.v2.users.$get(undefined, {
        headers: {
          authtoken: token,
        },
      });

      return r.json();
    },
  });
};

const post = api.v2.users.$post;
const put = api.v2.users.$put;

export const useCreateUser = () => useMutateUser(post);
export const useUpdateUser = () => useMutateUser(put);

const useMutateUser = (fn: typeof post | typeof put) => {
  const user = useAuthUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { avatar: Factions; displayName: string }) => {
      if (!user) return;
      const token = await Firebase.getTokenId();
      return fn(
        { json: payload },
        {
          headers: {
            authtoken: token,
          },
        },
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
