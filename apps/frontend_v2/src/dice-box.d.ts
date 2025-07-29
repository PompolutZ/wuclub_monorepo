declare module "@3d-dice/dice-box" {
  interface DiceBoxOptions {
    id?: string;
    assetPath?: string;
    startingHeight?: number;
    throwForce?: number;
    spinForce?: number;
    lightIntensity?: number;
    mass?: number;
    theme?: string;
    scale?: number;
  }

  export default class DiceBox {
    constructor(selector: string, options?: DiceBoxOptions);
    init(): Promise<void>;
    hide(): this;
    show(): this;
    roll(notation: string): this;
    onRollComplete: (results: unknown) => void;
    clear(): this;
  }
}
