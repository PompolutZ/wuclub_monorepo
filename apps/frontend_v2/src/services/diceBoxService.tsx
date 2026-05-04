// Singleton instance and initialization promise
type RollItem = {
  value: string | number;
  sides?: string | number;
  [key: string]: unknown;
};
type RollGroup = {
  rolls: RollItem[];
  [key: string]: unknown;
};

type DiceBoxInstance = {
  init: () => Promise<void>;
  clear: () => DiceBoxInstance;
  show: () => DiceBoxInstance;
  roll: (notation: string) => void;
  hide: () => DiceBoxInstance;
  onRollComplete: (results: unknown) => void;
};

let diceInstance: DiceBoxInstance | null = null;
let initPromise: Promise<DiceBoxInstance> | null = null;
let isEventListenerAdded = false;

async function ensureInitialized(): Promise<DiceBoxInstance> {
  if (diceInstance) return diceInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const DiceBox = await import("@3d-dice/dice-box");
    const instance = new DiceBox.default("#dice-box", {
      id: "dice-canvas",
      assetPath: "/assets/dice-box/",
      startingHeight: 10,
      throwForce: 6,
      spinForce: 6,
      lightIntensity: 0.9,
      mass: 1,
      theme: "underworlds",
      scale: 0.4,
    }) as DiceBoxInstance;

    await instance.init();

    if (!isEventListenerAdded) {
      document.addEventListener("mousedown", () => {
        const diceBoxCanvas = document.getElementById("dice-canvas");
        if (!diceBoxCanvas || !diceInstance) return;
        if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
          diceInstance.hide().clear();
        }
      });
      isEventListenerAdded = true;
    }

    instance.onRollComplete = () => {};
    diceInstance = instance;
    return instance;
  })();

  return initPromise;
}

export async function init() {
  await ensureInitialized();
  return {
    roll: (notation: string) => {
      if (!diceInstance) return;
      diceInstance.clear();
      const diceCount = Math.floor(Math.random() * 4) + 1;
      diceInstance.show().roll(`${diceCount}d${notation}`);
    },
  };
}

export async function preload() {
  await ensureInitialized();
}

export async function rollOnce(notation: string): Promise<RollItem[]> {
  const instance = await ensureInitialized();
  return new Promise<RollItem[]>((resolve) => {
    instance.onRollComplete = (results: unknown) => {
      const groups = (results ?? []) as RollGroup[];
      resolve(groups.flatMap((g) => g.rolls ?? []));
    };
    instance.clear();
    instance.show();
    instance.roll(notation);
  });
}
