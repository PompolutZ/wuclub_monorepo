import type { Factions } from "@fxdxpz/schema";
import type { Card, SetId } from "@fxdxpz/wudb";

export interface RoomDeck {
  deckId: string;
  name: string;
  factionId: string;
  faction: Factions;
  sets: SetId[];
  cards: Card[];
}

export interface Room {
  id: string;
  createdAt: number;
  deck: RoomDeck;
}

const STORAGE_PREFIX = "wuclub:room:";
const memory = new Map<string, Room>();

function storageKey(roomId: string) {
  return `${STORAGE_PREFIX}${roomId}`;
}

function readFromStorage(roomId: string): Room | undefined {
  try {
    const raw = sessionStorage.getItem(storageKey(roomId));
    return raw ? (JSON.parse(raw) as Room) : undefined;
  } catch {
    return undefined;
  }
}

function writeToStorage(room: Room) {
  try {
    sessionStorage.setItem(storageKey(room.id), JSON.stringify(room));
  } catch {
    // sessionStorage may be unavailable (private mode, quota) — memory still holds it
  }
}

export function createRoom(deck: RoomDeck): string {
  const id = crypto.randomUUID();
  const room: Room = { id, createdAt: Date.now(), deck };
  memory.set(id, room);
  writeToStorage(room);
  return id;
}

export function getRoom(roomId: string): Room | undefined {
  const cached = memory.get(roomId);
  if (cached) return cached;
  const restored = readFromStorage(roomId);
  if (restored) memory.set(roomId, restored);
  return restored;
}
