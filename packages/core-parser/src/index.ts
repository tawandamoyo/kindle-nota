import { parseRawClippings, parseSingleClipping } from "./parser.js";
import { Clipping } from "./interfaces.js";
export { Clipping }

export function parse(rawFile: string): Clipping[] {
    
    const rawClippings = parseRawClippings(rawFile);

    const parsedClippings: Clipping[] = rawClippings
        .map(clipping => parseSingleClipping(clipping))
        .filter((clipping): clipping is Clipping => clipping !== null);

    const uniqueClippingsMap = new Map<string, Clipping>();
    /* parsedClippings.forEach(clipping => {
        if (!uniqueClippingsMap.has(clipping.checksum)) {
                uniqueClippingsMap.set(clipping.checksum, clipping);
        };
    })
    const uniqueClippings = Array.from(uniqueClippingsMap.values()); */
    const uniqueClippings = parsedClippings;
    return uniqueClippings
};

