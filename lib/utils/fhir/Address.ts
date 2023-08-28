import * as r4 from "fhir/r4";

export interface AddressToStringOptions {
    includeAddress?: boolean;
    includeCityStateZip?: boolean;
    includeCountry?: boolean;
}

export interface Address extends r4.Address {}
export class Address {

    /**
     * Gets all addresses based on the given "use"
     */
    public static getAddressesByUse(addresses: Address[], use: r4.Address["use"]): Address[] {
        return addresses.filter(address => address.use === use);
    }

    /**
     * Return the city of the address
     */
    public static getCity(address: Address): string {
        return address.city || "";
    }

    /**
     * Return the state of the address
     */
    public static getState(address: Address): string {
        return address.state || "";
    }

    /**
     * Convert the address to a displayable string
     */
    public static toString(address: Address, lineSeparator: string = ", ", options: AddressToStringOptions = { includeAddress: true, includeCityStateZip: true, includeCountry: true }): string {
        if (!address) { return ""; }

        // Default options...
        if (options.includeAddress === undefined) { options.includeAddress = true; }
        if (options.includeCityStateZip === undefined) { options.includeCityStateZip = true; }
        if (options.includeCountry === undefined) { options.includeCountry = true; }

        const lines = Address.__formatLines(address.line);
        const cityStateZip = Address.__formatCityStateZip(address.city, address.state, address.postalCode);

        let pieces = [];
        if (options.includeAddress && lines) { pieces.push(lines); }
        if (options.includeCityStateZip && cityStateZip) { pieces.push(cityStateZip); }
        if (options.includeCountry && address.country) { pieces.push(address.country); }

        return pieces.join(lineSeparator);
    }

    // line1, line2
    private static __formatLines(lines?: string[], lineSeparator: string = ", "): string {
        if (!lines || lines.length === 0) { return ""; }
        return lines.join(lineSeparator);
    }

    // City, State Zip
    private static __formatCityStateZip(city?: string, state?: string, postalCode?: string): string
    {
        let s = "";
        if (city) { s += city; }
        if (city && state) { s += ", "; }
        if (state) { s += state; }
        if (postalCode) { s += " " + postalCode; }
        return s;
    }
}