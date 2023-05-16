import { users } from "../../utils/db.js";
import { sanitizeString } from "../../utils/utils.js";

export async function getUser(req, res) {
  try {
    if (!req.firebaseUID) {
      return res.status(401).send("Nope.");
    }

    const [payload] = await users()
      .find({ fuid: req.firebaseUID }, { projection: { _id: 0 } })
      .toArray();

    return res.json(payload);
  } catch (e) {
    console.error(e);
  }
}

export async function createUser(req, res) {
  try {
    if (!req.firebaseUID) {
      return res.status(401).send("Anonymous users cannot create accounts.");
    }

    const displayName = sanitizeString(req.body.displayName);
    const avatar = sanitizeString(req.body.avatar);
    await users().insertOne({
      displayName,
      fuid: req.firebaseUID,
      role: ["USER"],
      avatar: avatar,
    });

    return res.status(201).send("Ok");
  } catch (e) {
    console.error(e);
  }
}

export async function updateUser(req, res) {
  try {
    if (!req.firebaseUID) {
      return res.status(401).send("Anonymous users cannot create accounts.");
    }

    const displayName = sanitizeString(req.body.displayName);
    const avatar = sanitizeString(req.body.avatar);
    await users().updateOne(
      { fuid: req.firebaseUID },
      {
        $set: {
          displayName,
          avatar: avatar,
        },
      }
    );

    return res.send("Done");
  } catch (e) {
    console.error(e);
  }
}
