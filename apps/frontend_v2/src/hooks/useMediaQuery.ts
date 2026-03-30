import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const { matches } = matchMedia(query);
        setMatches(matches);
    }, [query])

    return matches;
}

type DeviceType = "mobile" | "laptop";

function getDeviceQuery(deviceType: DeviceType) {
    switch(deviceType) {
        case "mobile": return "(max-width: 640px)";
        case "laptop": return "(min-width: 1024px)";
        default: throw new Error("Unknown device type");
    }
}

export function useBreakpoint(device: DeviceType) {
    return useMediaQuery(getDeviceQuery(device));
}
