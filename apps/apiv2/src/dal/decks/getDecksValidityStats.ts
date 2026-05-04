import { getOrCreateClient } from "@/dal/client";

export type DecksValidityStats = {
  total: number;
  public: number;
  missingValidity: number;
  nemesisValid: number;
  publicListable: number;
};

export const getDecksValidityStats = async (): Promise<DecksValidityStats> => {
  const client = await getOrCreateClient();
  const [result] = await client
    .collection("decks")
    .aggregate<{
      total: { n: number }[];
      public: { n: number }[];
      missingValidity: { n: number }[];
      nemesisValid: { n: number }[];
      publicListable: { n: number }[];
    }>([
      { $match: { edition: 2 } },
      {
        $facet: {
          total: [{ $count: "n" }],
          public: [{ $match: { private: false } }, { $count: "n" }],
          missingValidity: [
            { $match: { validity: { $exists: false } } },
            { $count: "n" },
          ],
          nemesisValid: [
            { $match: { "validity.nemesis": true } },
            { $count: "n" },
          ],
          publicListable: [
            {
              $match: {
                private: false,
                "validity.nemesis": true,
                "validity.rivals": { $ne: true },
              },
            },
            { $count: "n" },
          ],
        },
      },
    ])
    .toArray();

  return {
    total: result?.total[0]?.n ?? 0,
    public: result?.public[0]?.n ?? 0,
    missingValidity: result?.missingValidity[0]?.n ?? 0,
    nemesisValid: result?.nemesisValid[0]?.n ?? 0,
    publicListable: result?.publicListable[0]?.n ?? 0,
  };
};
