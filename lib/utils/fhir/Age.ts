import * as r4 from "fhir/r4";
import { Quantity } from "./Quantity";

export interface Age extends r4.Age {}
export class Age {
    /**
     * Create an age from a Quantity
     */
    public static fromQuantity(quantity: r4.Quantity): Age {
        return quantity;
    }

    /**
     * Create an age from the years (actual age)
     */
    public static fromYears(years: number): Age {
        return new Quantity(years, "yr", "http://unitsofmeasure.org", "a");
    }
}