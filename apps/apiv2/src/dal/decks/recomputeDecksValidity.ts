import { getOrCreateClient } from "@/dal/client";
import { computeDeckValidity } from "@fxdxpz/wudb";
import { AnyBulkWriteOperation, Document } from "mongodb";

const BULK_CHUNK_SIZE = 1000;

export const recomputeDecksValidity = async () => {
  const client = await getOrCreateClient();
  const collection = client.collection("decks");

  const cursor = collection.find(
    { edition: 2 },
    { projection: { _id: 0, deckId: 1, deck: 1 } },
  );

  let total = 0;
  let updated = 0;
  let ops: AnyBulkWriteOperation<Document>[] = [];

  for await (const doc of cursor) {
    total += 1;
    const validity = computeDeckValidity(doc.deck ?? []);
    ops.push({
      updateOne: {
        filter: { deckId: doc.deckId },
        update: { $set: { validity } },
      },
    });

    if (ops.length >= BULK_CHUNK_SIZE) {
      const res = await collection.bulkWrite(ops);
      updated += res.modifiedCount;
      ops = [];
    }
  }

  if (ops.length > 0) {
    const res = await collection.bulkWrite(ops);
    updated += res.modifiedCount;
  }

  return { total, updated };
};
