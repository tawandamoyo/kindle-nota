import { ClippingType } from "./enums";

export interface Clipping {
    bookTitle: string;
    authors: string[];
    type: ClippingType;
    location: string;
    dateAdded: Date | undefined;
    text: string;
}