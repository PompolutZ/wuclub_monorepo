export const SETUP_STEPS = [
  { id: "warband", label: "Warband" },
  { id: "starting-hand", label: "Starting hand" },
  { id: "initiative", label: "Initiative" },
  { id: "territories", label: "Territories" },
  { id: "treasures", label: "Treasures" },
  { id: "fighters", label: "Fighters" },
  { id: "done", label: "Done" },
] as const;

export type SetupStep = (typeof SETUP_STEPS)[number];
export type SetupStepId = SetupStep["id"];

export function isWarbandChosen(warbandId: string) {
  return warbandId !== "u";
}

export function initialSetupStep(warbandId: string): SetupStepId {
  return isWarbandChosen(warbandId) ? "starting-hand" : "warband";
}

export function stepIndex(id: SetupStepId) {
  return SETUP_STEPS.findIndex((s) => s.id === id);
}
