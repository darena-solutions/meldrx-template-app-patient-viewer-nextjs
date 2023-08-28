import * as r4 from "fhir/r4";
import { HumanName } from "./HumanName";
import { Address } from "./Address";

export interface Patient extends r4.Patient {}
export class Patient {

    constructor() {
        (this as any).resourceType = "Patient";
    }

    // Get the patient's "official" name...
    public static getOfficialName(patient: Patient): r4.HumanName | undefined {
        if (!patient.name) { return undefined; }
        if (patient.name.length === 0) { return undefined; }
        const officialNames = HumanName.getNamesByUse(patient.name, "official");

        // If no official names, just pick one...
        return (officialNames.length > 0)
            ? officialNames[0]
            : patient.name[0];
    }

    // Get the patient's "home" address...
    public static getHomeAddress(patient: Patient): r4.Address | undefined {
        if (!patient.address) { return undefined; }
        if (patient.address.length === 0) { return undefined; }
        const officialAddresses = Address.getAddressesByUse(patient.address, "home");

        // If no official addresses, just pick one...
        return (officialAddresses.length > 0)
            ? officialAddresses[0]
            : patient.address[0];
    }

    /**
     * Get patient's birthdate as a Date object
     */
    public static getBirthDate(patient: Patient): Date | undefined {
        if (!patient.birthDate) { return undefined; }
        return new Date(patient.birthDate + "T00:00:00");   // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
    }
}