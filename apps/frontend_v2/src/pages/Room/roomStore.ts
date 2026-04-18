import { useSyncExternalStore } from "react";
import type { Card, SetId } from "@fxdxpz/wudb";
import { initialSetupStep, type SetupStepId } from "./setupSteps";

type Fighter = {
  name: string;
};

type Deck = {
  id: string;
  name: string;
  sets: SetId[];
  cards: Card[];
};

type Warband = {
  id: string;
  name: string;
  abbr: string;
  displayName: string;
  fighters: Fighter[];
};

export type RoomPlayer = {
  deck: Deck;
  warband: Warband;
  hand: Card[];
};

export type Room = {
  id: string;
  createdAt: number;
  host: RoomPlayer;
  guest: RoomPlayer | null;
  setupStep: SetupStepId;
};

const ROOM_PREFIX = "wuclub:room:";
const INDEX_KEY = "wuclub:rooms-by-host-deck";

const rooms = new Map<string, Room>();
const hostDeckIndex = new Map<string, string>();
const listeners = new Map<string, Set<() => void>>();

function notify(roomId: string) {
  listeners.get(roomId)?.forEach((l) => l());
}

function subscribe(roomId: string, listener: () => void) {
  let set = listeners.get(roomId);
  if (!set) {
    set = new Set();
    listeners.set(roomId, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) listeners.delete(roomId);
  };
}

export function useRoom(roomId: string): Room | undefined {
  return useSyncExternalStore(
    (listener) => subscribe(roomId, listener),
    () => getRoom(roomId),
  );
}

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
  const existing = hostDeckIndex.get(host.deck.id);
  if (existing && getRoom(existing)) return existing;

  const id = shortId();
  const room: Room = {
    id,
    createdAt: Date.now(),
    host,
    guest: null,
    setupStep: initialSetupStep(host.warband.id),
  };
  rooms.set(id, room);
  writeRoomToStorage(room);
  hostDeckIndex.set(host.deck.id, id);
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

type FactionLike = {
  id: string;
  name: string;
  abbr: string;
  displayName: string;
};

export function setHostWarband(roomId: string, faction: FactionLike) {
  const room = getRoom(roomId);
  if (!room) return;
  const next: Room = {
    ...room,
    host: {
      ...room.host,
      warband: {
        id: faction.id,
        name: faction.name,
        abbr: faction.abbr,
        displayName: faction.displayName,
        fighters: [],
      },
    },
    setupStep: "starting-hand",
  };
  rooms.set(roomId, next);
  writeRoomToStorage(next);
  notify(roomId);
}
