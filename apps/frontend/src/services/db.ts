import Dexie from "dexie";

const DB_NAME = "wudb";

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
  id: number;
  deckId: string;
  createdutc: number;
  deck: number[];
  faction: string;
  name: string;
  private: boolean;
  sets: number[];
  updatedutc: number;
};

export const offlineDB = new OfflineDatabase();
