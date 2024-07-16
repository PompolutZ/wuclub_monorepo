import axios from "axios";
import useAxios from "axios-hooks";
import Firebase from "../firebase";

axios.defaults.baseURL = import.meta.env.VITE_WUNDERWORLDS_API_ORIGIN;
axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await Firebase.getTokenId();
      if (token) {
        config.headers = {
          authtoken: token,
        };
      }
      return config;
    } catch (e) {
      console.error(e);
      return config;
    }
  },
  (error) => {
    console.error(error);
    Promise.reject(error);
  },
);

export const useCardsRatings = (manual = false) => useAxios({}, { manual });

export const useGetUserDeckById = (deckId: string, manual = false) =>
  useAxios(`/api/v1/user-decks/${deckId}`, { manual });
