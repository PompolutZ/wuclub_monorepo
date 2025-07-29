// Singleton instance and initialization promise
type DiceBoxInstance = {
  init: () => Promise<void>;
  clear: () => void;
  show: () => DiceBoxInstance;
  roll: (notation: string) => void;
  hide: () => DiceBoxInstance;
  onRollComplete: (callback: (results: unknown) => void) => void;
};

let diceInstance: DiceBoxInstance | null = null;
let initPromise: Promise<DiceBoxInstance> | null = null;
let isEventListenerAdded = false;

export async function init() {
  // If already initialized, return the existing instance
  if (diceInstance) {
    return {
      roll: (notation: string) => {
        if (!diceInstance) return;
        diceInstance.clear();
        const diceCount = Math.floor(Math.random() * 4) + 1;
        diceInstance.show().roll(`${diceCount}d${notation}`);
      },
    };
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    await initPromise;
    return {
      roll: (notation: string) => {
        if (!diceInstance) return;
        diceInstance.clear();
        const diceCount = Math.floor(Math.random() * 4) + 1;
        diceInstance.show().roll(`${diceCount}d${notation}`);
      },
    };
  }

  // Start initialization
  initPromise = (async () => {
    const DiceBox = await import("@3d-dice/dice-box");
    diceInstance = new DiceBox.default(
      "#dice-box", // target DOM element to inject the canvas for rendering
      {
        id: "dice-canvas", // canvas element id
        assetPath: "/assets/dice-box/",
        startingHeight: 10,
        throwForce: 6,
        spinForce: 6,
        lightIntensity: 0.9,
        mass: 1,
        theme: "underworlds", // default theme
        scale: 0.4,
      },
    ) as DiceBoxInstance;

    // Initialize the Dice Box
    await diceInstance.init();

    // Add event listener only once
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

    diceInstance.onRollComplete = () => {};

    return diceInstance;
  })();

  await initPromise;

  return {
    roll: (notation: string) => {
      if (!diceInstance) return;
      diceInstance.clear();
      // trigger the dice roll using the parser
      const diceCount = Math.floor(Math.random() * 4) + 1; // randomize number of dice
      diceInstance.show().roll(`${diceCount}d${notation}`);
    },
  };
}
