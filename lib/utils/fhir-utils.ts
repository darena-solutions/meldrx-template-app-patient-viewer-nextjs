import * as r4 from "fhir/r4";

export function formatName(name?: r4.HumanName): string {
    if (!name) { return "Unknown"; }
    return `${name.given?.join(" ")} ${name.family}`;
}

export function formatAddress(address: r4.Address): string {
    return `${address.line?.join(" ")} ${address.city}, ${address.state} ${address.postalCode}`;
}

export function formatRange(range: r4.Range): string {
    return `${range.low?.value} - ${range.high?.value}`;
}

export function parseRange(sRange: string): r4.Range {
    const [low, high] = sRange.split(" - ");
    return {
        low: {
            value: Number(low),
        },
        high: {
            value: Number(high),
        },
    };
}

export function formatQuantity(quantity: r4.Quantity): string {
    return `${quantity.value} ${quantity.unit}`;
}

export function parseQuantity(sQuantity: string): r4.Quantity {
    const [value, unit] = sQuantity.split(" ");
    return {
        value: Number(value),
        unit,
    };
}

export function getOfficialNameForPatient(patient: r4.Patient): r4.HumanName | undefined {
    return patient.name?.find((name) => name.use === "official") ?? patient.name?.[0];
}

export function getBirthDateForPatient(patient: r4.Patient): Date | undefined {
    return patient.birthDate ? new Date(patient.birthDate) : undefined;
}

export function getHomeAddressForPatient(patient: r4.Patient): r4.Address | undefined {
    return patient.address?.find((address) => address.use === "home") ?? patient.address?.[0];
}

export function getAgeFromBirthDate(birthDate: Date): number {
    return Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

export function sortCodeableConceptByDisplayText(a?: r4.CodeableConcept | undefined, b?: r4.CodeableConcept | undefined): number {
    if (!a && !b) { return 0; }
    if (!a) { return 1; }
    if (!b) { return -1; }
    return a.text?.localeCompare(b.text ?? "") ?? 0;
}