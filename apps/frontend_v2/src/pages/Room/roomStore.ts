import type { Card, SetId } from "@fxdxpz/wudb";

export interface RoomPlayer {
  deckId: string;
  deckName: string;
  factionId: string;
  sets: SetId[];
  cards: Card[];
}

export interface Room {
  id: string;
  createdAt: number;
  host: RoomPlayer;
  guest: RoomPlayer | null;
}

const ROOM_PREFIX = "wuclub:room:";
const INDEX_KEY = "wuclub:rooms-by-host-deck";

const rooms = new Map<string, Room>();
const hostDeckIndex = new Map<string, string>();

function roomKey(roomId: string) {
  return `${ROOM_PREFIX}${roomId}`;
}

function readRoomFromStorage(roomId: string): Room | undefined {
  try {
    const raw = sessionStorage.getItem(roomKey(roomId));
    return raw ? (JSON.parse(raw) as Room) : undefined;
  } catch {
    return undefined;
  }
}

function writeRoomToStorage(room: Room) {
  try {
    sessionStorage.setItem(roomKey(room.id), JSON.stringify(room));
  } catch {
    // sessionStorage may be unavailable (private mode, quota) — in-memory still holds it
  }
}

function readIndexFromStorage(): Map<string, string> {
  try {
    const raw = sessionStorage.getItem(INDEX_KEY);
    if (!raw) return new Map();
    return new Map(Object.entries(JSON.parse(raw) as Record<string, string>));
  } catch {
    return new Map();
  }
}

function writeIndexToStorage() {
  try {
    sessionStorage.setItem(
      INDEX_KEY,
      JSON.stringify(Object.fromEntries(hostDeckIndex)),
    );
  } catch {
    // ignore
  }
}

function hydrateIndex() {
  if (hostDeckIndex.size > 0) return;
  const stored = readIndexFromStorage();
  stored.forEach((roomId, deckId) => hostDeckIndex.set(deckId, roomId));
}

function shortId() {
  return crypto.randomUUID().split("-")[0];
}

export function findRoomIdByHostDeckId(deckId: string): string | undefined {
  hydrateIndex();
  const roomId = hostDeckIndex.get(deckId);
  if (!roomId) return undefined;
  // Verify the room still exists — stale index entries shouldn't leak back.
  const room = getRoom(roomId);
  if (!room) {
    hostDeckIndex.delete(deckId);
    writeIndexToStorage();
    return undefined;
  }
  return roomId;
}

export function createRoom(host: RoomPlayer): string {
  hydrateIndex();
  const existing = hostDeckIndex.get(host.deckId);
  if (existing && getRoom(existing)) return existing;

  const id = shortId();
  const room: Room = { id, createdAt: Date.now(), host, guest: null };
  rooms.set(id, room);
  writeRoomToStorage(room);
  hostDeckIndex.set(host.deckId, id);
  writeIndexToStorage();
  return id;
}

export function getRoom(roomId: string): Room | undefined {
  const cached = rooms.get(roomId);
  if (cached) return cached;
  const restored = readRoomFromStorage(roomId);
  if (restored) rooms.set(roomId, restored);
  return restored;
}
