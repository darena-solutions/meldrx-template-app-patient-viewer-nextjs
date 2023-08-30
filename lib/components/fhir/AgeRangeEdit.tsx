import React, { useState, useCallback } from "react";
import * as r4 from "fhir/r4";
import { Range } from "@/lib/utils/fhir/Range";

export interface IAgeRangeEditProps {
    placeholder?: string;

    value?: Range | undefined;
    onChange?: (text: string, value: Range | undefined) => void;
}

const AgeRangeEdit: React.FC<IAgeRangeEditProps> = (props: IAgeRangeEditProps) => {
    const [, setRangeValue] = useState<r4.Range | undefined>(props.value);
    const [rangeText, setRangeText] = useState<string>((props.value) ? Range.toAgeString(props.value, false) : "");

    const onChange = useCallback((e: any) => {
        const s = e.target.value;

        // Try to parse the range. If we can, then update the value and reformat.
        // If we can't, erase the value and leave the format as-is.
        const range = Range.fromAgeString(s);   // Can be undefined
        let text = (range) ? Range.toAgeString(range, false) : s;

        // Update state...
        setRangeValue(range);
        setRangeText(text);

        // Call client onChange...
        if (props.onChange) { props.onChange(text, range); }

    }, [props.onChange, setRangeValue, setRangeText]);

    return (
        <input type="text" className="AgeRangeEdit"
            placeholder={props.placeholder ?? ""}
            value={rangeText}
            onChange={onChange}
        />
    );
}

export default AgeRangeEdit;