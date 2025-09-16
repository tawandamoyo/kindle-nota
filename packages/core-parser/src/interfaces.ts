import { ClippingType } from "./enums.js";

export interface Clipping {
    bookTitle: string;
    authors: string[];
    type: ClippingType;
    location: string;
    dateAdded: Date | undefined;
    text: string;
}