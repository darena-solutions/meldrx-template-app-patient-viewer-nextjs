import React, { useState, useCallback } from "react";
import * as r4 from "fhir/r4";
import { Quantity } from "@/lib/utils/fhir/Quantity";

export interface IQuantityEditProps {
    placeholder?: string;

    value?: Quantity | undefined;
    onChange?: (text: string, value: Quantity | undefined) => void;
}
export const QuantityEdit: React.FC<IQuantityEditProps> = (props) => {
    const [, setQuantityValue] = useState<r4.Quantity | undefined>(props.value);
    const [quantityText, setQuantityText] = useState<string>((props.value) ? Quantity.toString(props.value) : "");

    const onChange = useCallback((e: any) => {
        const s = e.target.value;

        // Try to parse the value. If we can, then update the value and reformat.
        // If we can't, erase the value and leave the format as-is.
        const quantity = Quantity.fromString(s);   // Can be undefined
        let text = (quantity) ? Quantity.toString(quantity) : s;

        // Allow users to enter decimals and spaces (for the unit)...
        if (s.endsWith(".")) { text = s; }
        if (s.endsWith(" ")) { text = s; }

        // Update state...
        setQuantityValue(quantity);
        setQuantityText(text);

        // Call client onChange...
        if (props.onChange) { props.onChange(text, quantity); }

    }, [props.onChange, setQuantityValue, setQuantityText])

    return (
        <input type="text" className="QuantityEdit"
            placeholder={props.placeholder ?? ""}
            value={quantityText}
            onChange={onChange}
        />
    );
}

export default QuantityEdit;