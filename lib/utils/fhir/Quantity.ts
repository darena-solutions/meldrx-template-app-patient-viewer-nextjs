import * as r4 from "fhir/r4";

export interface Quantity extends r4.Quantity {}
export class Quantity {
    constructor(value: number, unit?: string, system?: string, code?: string, comparator?: r4.Quantity["comparator"]) {
        this.value = value;
        this.unit = unit;
        this.system = system;
        this.code = code;
        this.comparator = comparator;
    }

    /**
     * Convert Quantity to a string
     */
    public static toString(quantity?: Quantity, numFractionDigits?: number, includeComparator: boolean = true, includeUnits: boolean = true): string {
        if (!quantity) { return ""; }

        // If a fractionDigits was specified, use that...
        const value = (quantity.value && numFractionDigits) ? quantity.value.toFixed(numFractionDigits) : quantity.value;

        let s = "";
        if (includeComparator && quantity.comparator) { s += quantity.comparator; }
        if (quantity.value) { s += value; }
        if (includeUnits && quantity.unit) { s += " " + quantity.unit; }
        return s;
    }

    /**
     * Parse a string into a Range element.
     * 50
     * 50 day
     * >50
     * >50 day
     * >=50
     * >=50 day
     */
    public static fromString(s: string): Quantity | undefined {
        // IMPORTANT: Keep the comparators in order of longest to shortest or else the "startsWith" will pick the wrong one
        const comparators: r4.Quantity["comparator"][] = ["<=", ">=", "<", ">"];
        let comparator: r4.Quantity["comparator"];
        let value: number | undefined;
        let unit: string | undefined;

        // Check if it starts with a comparator and then remove it...
        comparators.forEach((currentComparator: r4.Quantity["comparator"]) => {
            if (!currentComparator) { return; }
            if (s.startsWith(currentComparator)) {
                comparator = currentComparator;
                s = s.substring(currentComparator.length);
                return;
            }
        });

        // Split the string into value and unit...
        const parts = s.split(" ");
        if (parts.length === 0) { return undefined; }

        // Get the value...
        value = parseFloat(parts[0]);
        if (isNaN(value)) { return undefined; }

        // Get the unit...
        if (parts.length > 1) {
            unit = parts.slice(1).join(" ");
        }

        // Create the Quantity...
        return new Quantity(value, unit, undefined, undefined, comparator);
    }

    /**
     * Sort the quantity by value (ascending order)
     */
    public static sortByValueAscending(a?: Quantity, b?: Quantity): number {
        if (!a && !b) { return 0; }
        if (!a) { return -1; }
        if (!b) { return 1; }
        if (a.value === b.value) { return 0; }
        if (a.value === undefined) { return -1; }
        if (b.value === undefined) { return 1; }
        return a.value - b.value;
    }
}