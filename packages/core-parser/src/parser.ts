
import { parse } from 'date-fns';
import * as crypto from 'node:crypto';
import { ClippingType } from "./enums";
import { Clipping } from "./interfaces";

export function parseRawClippings(clippings) {
    return clippings.split(/^==========\r?\n/m)
    .map(entry => entry.trim())
    .filter(entry => entry !== '');
}

export function parseSingleClipping(clipping: string): Clipping | null {
    if (!clipping || clipping.trim() === '') return null;

    const lines = clipping
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
        
    if (lines.length < 3) return null;

    const firstLine = lines[0];
    const bookMatch = firstLine.match(/^(.*)\s\((.*)\)$/);

    const bookTitle = bookMatch ? bookMatch[1].trim() : firstLine.trim();
    const authors = bookMatch?.length === 3 ? bookMatch[2].split(',').map(name => name.trim()) : ['Unknown Author'];

    const secondLine = lines[1];
    const metaMatch = secondLine.match(/^- Your (?<type>Highlight|Note|Bookmark) (?:on|at) (?:Location|page) (?<loc>[\d-]+)(?: \| Added on (?<date>.+))?/i);

    if (!metaMatch?.groups) {
        console.error(`Malformed metadata line: ${secondLine}`);
        console.error(`malformed clipping: \n---\n ${clipping} \n---\n`);
        return null;            
    }

    const { type: rawType, loc: location, date: rawDate} = metaMatch.groups;

    const clippingType: ClippingType = (() => {
        switch (rawType.toLowerCase()) {
            case 'highlight':
                return ClippingType.Highlight;
            case 'note':
                return ClippingType.Note;
            case 'bookmark':
                return ClippingType.Bookmark;
            default:
                return ClippingType.Highlight; 
        }       
    })();

    let dateAdded: Date | undefined;
    if (rawDate) {
        try {
            dateAdded = parse(rawDate, 'EEEE, MMMM d, yyyy h:mm:ss a', new Date());
            if (isNaN(dateAdded.getTime())) {
                dateAdded = new Date(rawDate);
                if (isNaN(dateAdded.getTime())) {
                    dateAdded = undefined;
                }
            }
        } catch {
            dateAdded = undefined;
        }
    }

    const text = lines
            .slice(2)
            .map(line => line.trim())
            .join('\n')
            .trim();

    if (!text) return null;

    const checksum = crypto.createHash('md5').update(text).digest('hex');
        

    return {
        bookTitle,
        authors,
        type: clippingType,
        location,
        dateAdded,
        text,
        checksum
    };
}
