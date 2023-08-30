import * as r4 from "fhir/r4";
import { Quantity } from "./Quantity";

export interface Range extends r4.Range {}
export class Range {
    constructor(low?: r4.Quantity | undefined, high?: r4.Quantity | undefined) {
        if (low) { this.low = low; }
        if (high) { this.high = high; }
    }

    /**
     * Get a range from unspecified numbers
     */
    public static fromNumbers(low: number, high?: number): Range {
        return new Range(
            new Quantity(low, ""),
            (high) ? new Quantity(high, "") : undefined
        );
    }

    /**
     * Parse a string into a Range element.
     * Valid formats:
     *      50
     *      50-75
     *      50 - 75
     */
    public static fromString(s: string): Range | undefined {
        // Single Number...
        if (!isNaN(s as any)) {
            const f: number = parseFloat(s);
            return Range.fromNumbers(f);
        }

        // Range (e.g. "35-40")...
        if (s.indexOf("-") >= 0) {
            const s1 = s.split("-")[0];
            const s2 = s.split("-")[1];

            if (!isNaN(s1 as any) && !isNaN(s2 as any) && s1.trim() !== "" && s2.trim() !== "") {
                const f1 = parseFloat(s1);
                const f2 = parseFloat(s2);
                return Range.fromNumbers(f1, f2);
            }
        }

        return undefined;
    }

    /**
     * Parse a string into a Range element. Specifically for age ranges.
     * This allows you to also use formats like "40's" or "40s"
     */
    public static fromAgeString(s: string): Range | undefined {

        // Same decade (e.g. "40's", "40s") (Note: "late 40s" will just be "40s")
        if (s.indexOf("s") >= 0) {
            // All this does is convert "40s" to "40-49" to be processed by the range block (changes "s" to be like "40-49")
            let decadeString = s.split("s")[0];
            if (decadeString.indexOf("'") >= 0) { decadeString = decadeString.replace("'", ""); }
            if (!isNaN(decadeString as any)) {
                const decadeNumber = parseInt(decadeString);
                const decadeEnd = decadeNumber + 9;
                s = decadeNumber.toString() + "-" + decadeEnd.toString();
            }
        }

        // Now use the default Range parsing...
        return Range.fromString(s);
    }

    /**
     * Convert Range to a string
     */
    public static toString(range: Range, includeUnits: boolean = true): string {
        if (!range) { return ""; }

        let s = "";
        if (range.low && !Number.isNaN(range.low.value)) { s += range.low.value; }
        if (includeUnits && range.low && range.low.unit) { s += " " + range.low.unit; }
        if (range.high && !Number.isNaN(range.high.value)) { s += " - " + range.high.value; }
        if (includeUnits && range.high && range.high.unit) { s += " " + range.high.unit; }
        return s;
    }

    /**
     * Convert Range to an age string. Values MUST be in years
     */
    public static toAgeString(range: Range, includeUnits: boolean = true): string {
        if (!range) { return ""; }

        let s = "";
        s += Range.toString(range, false);
        if (includeUnits) { s += "y"; }
        return s;
    }

    /**
     * Sort the range by low value
     */
    public static sortByLowValue(a?: Range, b?: Range): number {
        if (!a || !b) { return -1; }
        if (!a.low || !b.low) { return -1; }
        return Quantity.sortByValueAscending(a.low, b.low);
    }

    /**
     * Sort the range by high value
     */
    public static sortByHighValue(a?: Range, b?: Range): number {
        if (!a || !b) { return -1; }
        if (!a.high || !b.high) { return -1; }
        return Quantity.sortByValueAscending(a.high, b.high);
    }
}