import React, { useState, useCallback } from "react";
import * as r4 from "fhir/r4";
import { formatQuantity, parseQuantity } from "@/lib/utils/fhir-utils";

export interface IQuantityEditProps {
    placeholder?: string;

    value?: r4.Quantity | undefined;
    onChange?: (text: string, value: r4.Quantity | undefined) => void;
}
export const QuantityEdit: React.FC<IQuantityEditProps> = (props) => {
    const [, setQuantityValue] = useState<r4.Quantity | undefined>(props.value);
    const [quantityText, setQuantityText] = useState<string>((props.value) ? formatQuantity(props.value) : "");

    const onChange = useCallback((e: any) => {
        const s = e.target.value;

        // Try to parse the value. If we can, then update the value and reformat.
        // If we can't, erase the value and leave the format as-is.
        const quantity = parseQuantity(s);
        let text = (quantity) ? formatQuantity(quantity) : s;

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