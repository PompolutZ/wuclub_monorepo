import Dexie from "dexie";

const DB_NAME = "wudb";

// TODO: https://github.com/PompolutZ/wuclub_monorepo/issues/4
class OfflineDatabase extends Dexie {
  anonDecks!: Dexie.Table<AnonDecks, number>;

  constructor() {
    super(DB_NAME);
    this.version(3).stores({
      anonDecks:
        "++id,deckId,createdutc,deck,faction,name,private,sets,updatedutc",
    });
  }
}

export type AnonDecks = {
  deckId: string;
  createdutc: number;
  deck: number[];
  faction: string;
  name: string;
  private: boolean;
  sets: (number | string)[];
  updatedutc: number;
};

export const offlineDB = new OfflineDatabase();
