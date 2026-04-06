import { validateCardForPlayFormat } from "@fxdxpz/wudb";
import type { CardId } from "@fxdxpz/wudb";

export const checkStandalone = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
};

const colors = {
  default: "Black",
  restricted: "Goldenrod",
  banned: "DarkRed",
};

const backgroundColors = {
  default: "White",
  restricted: "Goldenrod",
  banned: "DarkRed",
};

export const pickCardColor2 = (id: CardId | string, format: string) => {
  const [, isForsaken, isRestricted] = validateCardForPlayFormat(
    id as CardId,
    format as never,
  );

  if (isForsaken) {
    return colors["banned"];
  }

  if (isRestricted) {
    return colors["restricted"];
  }

  return colors["default"];
};

export const pickCardBackgroundColor2 = (
  id: CardId | string,
  format: string,
) => {
  const [, isForsaken, isRestricted] = validateCardForPlayFormat(
    id as CardId,
    format as never,
  );

  if (isForsaken) {
    return backgroundColors["banned"];
  }

  if (isRestricted) {
    return backgroundColors["restricted"];
  }

  return backgroundColors["default"];
};
