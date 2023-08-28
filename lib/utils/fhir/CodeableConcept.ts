import * as r4 from "fhir/r4";
import { Coding } from "./Coding";

export interface CodeableConcept extends r4.CodeableConcept {}
export class CodeableConcept {
    constructor(coding: r4.Coding[], text?: string) {
        this.coding = coding;
        this.text = text;
    }

    public static fromSingleCoding(coding: r4.Coding, text?: string): CodeableConcept {
        return new CodeableConcept([coding], text);
    }

    /**
     * Gets displayable text for a CodeableConcept
     * If coding exists, returns all values separated by a comma.
     * Otherwise, returns the "text" value.
     * Returns "" if nothing is found.
    */
    public static getDisplayText(codeableConcept: CodeableConcept, onlyFirstCode: boolean = false): string {
        if (!codeableConcept.coding && !codeableConcept.text) { return ""; }

        // Try to get display from the coding property...
        if (codeableConcept.coding) {
            if (onlyFirstCode) {
                const display = codeableConcept.coding[0].display;
                if (display) { return display; }
            } else {
                const allDisplays = codeableConcept.coding
                    .map((x: r4.Coding) => Coding.toString(x))
                    .filter((x: string) => !!x)
                    .join(", ");
                if (allDisplays) { return allDisplays; }
            }
        }

        // If we got here, then the coding property didn't have "display", so check for "text"...
        if (codeableConcept.text) { return codeableConcept.text; }

        // If we got here, just return blank...
        return "";
    }

    /** Sorts CodeableConcept by displayText */
    public static sortByDisplayText(a?: CodeableConcept, b?: CodeableConcept): number {
        if (!a || !b) { return -1; }

        const sa = CodeableConcept.getDisplayText(a);
        const sb = CodeableConcept.getDisplayText(b);
        return sa.localeCompare(sb);
    }
}