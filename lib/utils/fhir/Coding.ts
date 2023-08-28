import * as r4 from "fhir/r4";

export interface Coding extends r4.Coding {}
export class Coding {
    constructor(system: string, code: string, display: string) {
        this.system = system;
        this.code = code;
        this.display = display;
    }

    /**
     * Display Coding
     */
    public static toString(coding: Coding): string {
        if (!coding) { return ""; }
        if (coding.display) { return coding.display; }
        if (coding.code) { return coding.code; }
        return "";
    }

    /**
     * Filter codings based on system
     */
    public static getCodingsBySystem(codings: Coding[], system: string): Coding[] {
        return codings.filter(coding => coding.system === system);
    }

    /**
     * Filter codings based on code
     */
    public static getCodingsByCode(codings: Coding[], code: string): Coding[] {
        return codings.filter(coding => coding.code === code);
    }
}