import { card_ratings } from "../../utils/db.js";
import { sanitizeString } from "../../utils/utils.js";

export async function getAllRatings(req, res) {
  const result = await card_ratings()
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return res.json(result);
}

export async function getRatingsForSingleFaction(req, res) {
  const { faction } = req.params;
  const sanitized = sanitizeString(faction);

  let payload;
  if (sanitized === "universal") {
    payload = await card_ratings()
      .find({ faction: sanitized }, { projection: { _id: 0 } })
      .toArray();
  } else {
    payload = await card_ratings()
      .find(
        { faction: { $in: [sanitized, "universal"] } },
        { projection: { _id: 0 } }
      )
      .toArray();
  }

  return res.json(payload);
}
