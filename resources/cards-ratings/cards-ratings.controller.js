import { card_ratings, users } from "../../utils/db.js";
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

export async function updateRatingsForSingleFaction(req, res) {
  const faction = sanitizeString(req.params.faction);

  const admins = await users().find({ fuid: req.firebaseUID, role: "ADMIN" }).toArray();
  if (admins.length === 0) {
    return res.status(403).send('You cannot perform requested operation.');
  }

  const success = await card_ratings().updateOne({ faction }, { $set: req.body });
  console.log(success);
  
  return res.send('OK');
}
