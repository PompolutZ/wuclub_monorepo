import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);

  useEffect(() => {
    const mql = matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

type DeviceType = "mobile" | "laptop";

function getDeviceQuery(deviceType: DeviceType) {
  switch (deviceType) {
    case "mobile":
      return "(max-width: 640px)";
    case "laptop":
      return "(min-width: 1024px)";
    default:
      throw new Error("Unknown device type");
  }
}

export function useBreakpoint(device: DeviceType) {
  return useMediaQuery(getDeviceQuery(device));
}
