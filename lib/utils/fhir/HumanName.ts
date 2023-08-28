import * as r4 from "fhir/r4";

export interface HumanNameToStringOptions {
    includePrefix?: boolean;
    includeSuffix?: boolean;
    includeUse?: boolean;
}

export interface HumanName extends r4.HumanName {}
export class HumanName {

    constructor(given: string[], family: string, use: r4.HumanName["use"], text?: string) {
        this.given = given;
        this.family = family;
        this.use = use;
        this.text = (text) ? text : HumanName.toString(this);
    }

    // Gets all names based on the given "use"...
    public static getNamesByUse(names: HumanName[], use: r4.HumanName["use"]): HumanName[] {
        return names.filter(name => name.use === use);
    }

    // Convert name to a string...
    public static toString(name: HumanName, options: HumanNameToStringOptions = { includePrefix: true, includeSuffix: true, includeUse: false }): string {
        // If text is available, use that...
        if (name.text) { return name.text; }

        // Get all name pieces...
        let pieces = [];
        if (options.includePrefix) {
            if (name.prefix) {
                if (Array.isArray(name.prefix)) { pieces.push(...name.prefix); }
                else { pieces.push(name.prefix); }
            }
        }

        if (name.given) {
            if (Array.isArray(name.given)) { pieces.push(...name.given); }
            else { pieces.push(name.given); }
        }

        if (name.family) {
            if (Array.isArray(name.family)) { pieces.push(...name.family); }
            else { pieces.push(name.family); }
        }

        if (options.includeSuffix) {
            if (name.suffix) {
                if (Array.isArray(name.suffix)) { pieces.push(...name.suffix); }
                else { pieces.push(name.suffix); }
            }
        }

        // Format all pieces...
        let sName = pieces.join(" ").trim();
        return sName;
    }
}